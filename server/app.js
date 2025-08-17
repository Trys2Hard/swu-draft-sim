require('dotenv').config()

const express = require('express')
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose')
const Card = require('./models/Card')

const app = express()
const PORT = process.env.PORT || 3000;

if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment variables');
    process.exit(1);
}

const allowedOrigins = [
    'http://localhost:5173',
    'https://www.swudraftsim.com',
    'https://swudraftsim.com'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
}));

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json())
app.use(helmet());

// routes
app.get('/api/leader', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    if (!set) {
        return res.status(400).json({ error: 'Set parameter is required' });
    }

    try {
        const rareLeaderChance = Math.random() < 0.2;
        const leaderRarity = rareLeaderChance ? 'Rare' : 'Common';

        const leaderArr = await Card.aggregate([
            { $match: { Set: set, Type: 'Leader', VariantType: 'Normal', Rarity: leaderRarity } },
            { $sample: { size: 1 } }
        ]);
        if (!leaderArr.length) {
            return res.status(404).json({ error: 'No leader found' });
        }
        const randomLeader = leaderArr[0];
        res.json({ cardData: randomLeader });
    } catch (error) {
        console.error('Error fetching leader:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

app.get('/api/rare', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const legendaryChance = Math.random() < 0.2;
        const rareSlotRarity = legendaryChance ? 'Legendary' : 'Rare';

        const rareArr = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Normal', Rarity: rareSlotRarity } },
            { $sample: { size: 1 } }
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
})

app.get('/api/uncommon', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const uncommonArr = await Card.aggregate([
            { $match: { Set: set, Rarity: 'Uncommon', VariantType: 'Normal', } },
            { $sample: { size: 1 } }
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
})

app.get('/api/common', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const commonArr = await Card.aggregate([
            { $match: { Set: set, Type: { $nin: ['Leader', 'Base'] }, VariantType: 'Normal', Rarity: 'Common' } },
            { $sample: { size: 1 } }
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
})

// React Router fallback
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});


// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(error)
    })
