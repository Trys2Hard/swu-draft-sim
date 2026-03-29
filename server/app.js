require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const Card = require('./models/Card');

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
  console.error('Missing MONGO_URI in environment variables');
  process.exit(1);
}

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.swudraftsim.com',
  'https://swudraftsim.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());
app.use(helmet());

// routes
app.get('/api/leader', async (req, res) => {
  const set = req.query.set?.toUpperCase();
  const sealedPool = req.query.sealedPool === 'true';
  const draftPack = req.query.draftPack === 'true';
  const count = Number.parseInt(req.query.count, 10);

  if (!set) {
    return res.status(400).json({ error: 'Set parameter is required' });
  }

  const sampleRandomLeader = async (match) => {
    const leaderArr = await Card.aggregate([
      { $match: match },
      { $sample: { size: 1 } },
    ]);
    return leaderArr[0] || null;
  };

  const chooseLeaderRarity = () => (Math.random() < 0.2 ? 'Rare' : 'Common');

  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  try {
    if (sealedPool && count === 6) {
      const poolRoll = Math.random();
      let uniqueTarget = 6;

      if (poolRoll < 0.5) {
        uniqueTarget = 6;
      } else if (poolRoll < 0.95) {
        uniqueTarget = 5;
      } else {
        uniqueTarget = 4;
      }

      const uniqueLeaders = [];
      const seenLeaderIds = new Set();
      let attempts = 0;
      const maxAttempts = 100;

      while (uniqueLeaders.length < uniqueTarget && attempts < maxAttempts) {
        attempts++;
        const leaderRarity = chooseLeaderRarity();

        let leader = await sampleRandomLeader({
          Set: set,
          Type: 'Leader',
          VariantType: 'Normal',
          Rarity: leaderRarity,
        });

        // Fallback in case set data doesn't support the selected rarity.
        if (!leader) {
          leader = await sampleRandomLeader({
            Set: set,
            Type: 'Leader',
            VariantType: 'Normal',
          });
        }

        if (!leader || seenLeaderIds.has(String(leader._id))) {
          continue;
        }

        uniqueLeaders.push(leader);
        seenLeaderIds.add(String(leader._id));
      }

      if (uniqueLeaders.length < uniqueTarget) {
        return res
          .status(404)
          .json({ error: 'Not enough leaders found for pool' });
      }

      let leaderPool = [...uniqueLeaders];

      if (uniqueTarget === 5) {
        const dupIdx = Math.floor(Math.random() * uniqueLeaders.length);
        leaderPool.push(uniqueLeaders[dupIdx]);
      } else if (uniqueTarget === 4) {
        const tripleOneLeader = Math.random() < 0.5;

        if (tripleOneLeader) {
          const dupIdx = Math.floor(Math.random() * uniqueLeaders.length);
          leaderPool.push(uniqueLeaders[dupIdx], uniqueLeaders[dupIdx]);
        } else {
          const firstIdx = Math.floor(Math.random() * uniqueLeaders.length);
          let secondIdx = Math.floor(Math.random() * uniqueLeaders.length);
          while (secondIdx === firstIdx) {
            secondIdx = Math.floor(Math.random() * uniqueLeaders.length);
          }
          leaderPool.push(uniqueLeaders[firstIdx], uniqueLeaders[secondIdx]);
        }
      }

      leaderPool = shuffle(leaderPool);
      return res.json({ cardsData: leaderPool });
    }

    if (draftPack && count === 3) {
      const poolRoll = Math.random();
      const uniqueTarget = poolRoll < 0.9 ? 3 : 2;

      const uniqueLeaders = [];
      const seenLeaderIds = new Set();
      let attempts = 0;
      const maxAttempts = 100;

      while (uniqueLeaders.length < uniqueTarget && attempts < maxAttempts) {
        attempts++;
        const leaderRarity = chooseLeaderRarity();

        let leader = await sampleRandomLeader({
          Set: set,
          Type: 'Leader',
          VariantType: 'Normal',
          Rarity: leaderRarity,
        });

        // Fallback in case set data doesn't support the selected rarity.
        if (!leader) {
          leader = await sampleRandomLeader({
            Set: set,
            Type: 'Leader',
            VariantType: 'Normal',
          });
        }

        if (!leader || seenLeaderIds.has(String(leader._id))) {
          continue;
        }

        uniqueLeaders.push(leader);
        seenLeaderIds.add(String(leader._id));
      }

      if (uniqueLeaders.length < uniqueTarget) {
        return res
          .status(404)
          .json({ error: 'Not enough leaders found for draft' });
      }

      const leaderPool = [...uniqueLeaders];

      // With uniqueTarget = 2, this produces exactly one duplicate (2+1),
      // guaranteeing no leader appears 3 times in a draft leader pack.
      if (uniqueTarget === 2) {
        const dupIdx = Math.floor(Math.random() * uniqueLeaders.length);
        leaderPool.push(uniqueLeaders[dupIdx]);
      }

      return res.json({ cardsData: shuffle(leaderPool) });
    }

    const rareLeaderChance = Math.random() < 0.2;
    const leaderRarity = rareLeaderChance ? 'Rare' : 'Common';

    const randomLeader = await sampleRandomLeader({
      Set: set,
      Type: 'Leader',
      VariantType: 'Normal',
      Rarity: leaderRarity,
    });

    if (!randomLeader) {
      return res.status(404).json({ error: 'No leader found' });
    }

    res.json({ cardData: randomLeader });
  } catch (error) {
    console.error('Error fetching leader:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/special', async (req, res) => {
  const set = req.query.set?.toUpperCase();
  try {
    const specialArr = await Card.aggregate([
      {
        $match: {
          Set: set,
          Type: { $ne: 'Leader' },
          VariantType: 'Normal',
          Rarity: 'Special',
        },
      },
      { $sample: { size: 1 } },
    ]);
    if (!specialArr.length) {
      return res.status(404).json({ error: 'No special card found' });
    }
    const randomSpecial = specialArr[0];
    res.json({ cardData: randomSpecial });
  } catch (error) {
    console.error('Error fetching special card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/legendary', async (req, res) => {
  const set = req.query.set?.toUpperCase();
  try {
    const legendaryArr = await Card.aggregate([
      {
        $match: {
          Set: set,
          Type: { $ne: 'Leader' },
          VariantType: 'Normal',
          Rarity: 'Legendary',
        },
      },
      { $sample: { size: 1 } },
    ]);
    if (!legendaryArr.length) {
      return res.status(404).json({ error: 'No legendary card found' });
    }
    const randomLegendary = legendaryArr[0];
    res.json({ cardData: randomLegendary });
  } catch (error) {
    console.error('Error fetching legendary card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/rare', async (req, res) => {
  const set = req.query.set?.toUpperCase();
  try {
    const rareArr = await Card.aggregate([
      {
        $match: {
          Set: set,
          Type: { $ne: 'Leader' },
          VariantType: 'Normal',
          Rarity: 'Rare',
        },
      },
      { $sample: { size: 1 } },
    ]);
    if (!rareArr.length) {
      return res.status(404).json({ error: 'No rare card found' });
    }
    const randomRare = rareArr[0];
    res.json({ cardData: randomRare });
  } catch (error) {
    console.error('Error fetching rare card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/uncommon', async (req, res) => {
  const set = req.query.set?.toUpperCase();

  try {
    const uncommonArr = await Card.aggregate([
      { $match: { Set: set, Rarity: 'Uncommon', VariantType: 'Normal' } },
      { $sample: { size: 1 } },
    ]);
    if (!uncommonArr.length) {
      return res.status(404).json({ error: 'No uncommon card found' });
    }
    const randomUncommon = uncommonArr[0];
    res.json({ cardData: randomUncommon });
  } catch (error) {
    console.error('Error fetching uncommon cards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/common', async (req, res) => {
  const set = req.query.set?.toUpperCase();

  try {
    const commonArr = await Card.aggregate([
      {
        $match: {
          Set: set,
          Type: { $nin: ['Leader', 'Base'] },
          VariantType: 'Normal',
          Rarity: 'Common',
        },
      },
      { $sample: { size: 1 } },
    ]);
    if (!commonArr.length) {
      return res.status(404).json({ error: 'No common card found' });
    }
    const randomCommon = commonArr[0];
    res.json({ cardData: randomCommon });
  } catch (error) {
    console.error('Error fetching common cards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/foil', async (req, res) => {
  const set = req.query.set?.toUpperCase();
  const variant =
    set === 'LOF' ? 'Hyperspace Foil' : set === 'SEC' ? 'Foil' : 'Hyperspace';

  try {
    // Determine rarity based on odds (similar to leader endpoint)
    const random = Math.random();
    let foilRarity;

    if (random < 0.02) {
      // 2% chance for Legendary
      foilRarity = 'Legendary';
    } else if (random < 0.12) {
      // 10% chance for Special
      foilRarity = 'Special';
    } else if (random < 0.2) {
      // 8% chance for Rare
      foilRarity = 'Rare';
    } else if (random < 0.5) {
      // 30% chance for Uncommon
      foilRarity = 'Uncommon';
    } else {
      // 50% chance for Common
      foilRarity = 'Common';
    }

    const foilArr = await Card.aggregate([
      {
        $match: {
          Set: set,
          Type: { $ne: 'Leader' },
          VariantType: variant,
          Rarity: foilRarity,
          $nor: [{ Rarity: 'Common', Type: 'Base' }],
        },
      },
      { $sample: { size: 1 } },
    ]);

    if (!foilArr.length) {
      // Fallback: if no cards found for selected rarity, try any foil card
      const fallbackFoilArr = await Card.aggregate([
        { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: variant } },
        { $sample: { size: 1 } },
      ]);

      if (!fallbackFoilArr.length) {
        return res.status(404).json({ error: 'No foil card found' });
      }

      const randomFoil = fallbackFoilArr[0];
      res.json({ cardData: randomFoil });
    } else {
      const randomFoil = foilArr[0];
      res.json({ cardData: randomFoil });
    }
  } catch (error) {
    console.error('Error fetching foil card:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/card/:id', async (req, res) => {
  const id = req.params.id;

  if (!id.includes('_')) {
    return res
      .status(400)
      .json({ error: 'Invalid card ID format. Expected SET_NUMBER.' });
  }

  const [set, number] = id.split('_');
  const upperSet = set.toUpperCase();

  try {
    const card = await Card.findOne({ Set: upperSet, Number: number });

    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ cardData: card });
  } catch (error) {
    console.error('Error fetching card by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/bases/:set', async (req, res) => {
  const set = req.params.set.toUpperCase();
  try {
    const bases = await Card.find({
      Set: set,
      Type: 'Base',
      VariantType: 'Normal',
    });

    res.json(bases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// React Router fallback
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
