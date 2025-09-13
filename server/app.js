require('dotenv').config()

const express = require('express')
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose')
const Card = require('./models/Card')
const { parsePromptToFilter } = require('./utils/parsePromptToFilter')


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

// Escape user input for safe use in RegExp
function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}


// Helper function to search for cards in the database
async function searchCards(searchTerm) {
    try {
        // Search for cards by name (case insensitive) across all sets
        const cards = await Card.find({
            Name: { $regex: searchTerm, $options: 'i' },
            VariantType: 'Normal'
        }).limit(200); // Increased limit to show more results

        return cards;
    } catch (error) {
        console.error('Error searching cards:', error);
        return [];
    }
}

// Helper function to search for exact name matches (case-insensitive)
async function searchCardsExact(searchTerm) {
    try {
        const trimmed = (searchTerm || '').trim();
        if (!trimmed) return [];
        const regex = new RegExp(`^${escapeRegex(trimmed)}$`, 'i');
        const cards = await Card.find({
            Name: { $regex: regex },
            VariantType: 'Normal'
        }).limit(100);
        return cards;
    } catch (error) {
        console.error('Error searching exact cards:', error);
        return [];
    }
}

// routes
app.post("/api/card-search", async (req, res) => {
    try {
        const { prompt, page: rawPage, pageSize: rawPageSize } = req.body;
        const page = Math.max(1, Number(rawPage) || 1);
        const pageSize = Math.min(200, Math.max(1, Number(rawPageSize) || 50));
        const skip = (page - 1) * pageSize;

        // First: try to parse structured intent (cost/aspects/etc.)
        const { filter: parsedFilter, limit: parsedLimit, hasMeaningful } = parsePromptToFilter(prompt);
        if (hasMeaningful) {
            let results;
            let total = 0;
            if (parsedFilter._random) {
                const match = { ...parsedFilter };
                delete match._random;
                results = await Card.aggregate([
                    { $match: match },
                    { $sample: { size: parsedLimit || 1 } }
                ]);
                total = results.length;
            } else {
                total = await Card.countDocuments(parsedFilter);
                results = await Card.find(parsedFilter).skip(skip).limit(pageSize);
            }
            const cards = results;

            // Deduplicate by _id just in case
            const seenIds = new Set();
            const uniqueCards = cards.filter((card) => {
                const id = String(card._id);
                if (seenIds.has(id)) return false;
                seenIds.add(id);
                return true;
            });

            console.log(`Parsed filter hit. Prompt: "${prompt}" ->`, parsedFilter, `limit=${parsedLimit}`, `results=${uniqueCards.length}`);

            return res.json({
                page,
                pageSize: parsedFilter._random ? 1 : pageSize,
                total,
                totalPages: parsedFilter._random ? 1 : Math.max(1, Math.ceil(total / pageSize)),
                cards: uniqueCards.map(card => ({
                    name: card.Name,
                    type: card.Type,
                    rarity: card.Rarity,
                    cost: card.Cost,
                    power: card.Power,
                    hp: card.HP,
                    frontText: card.FrontText,
                    frontArt: card.FrontArt,
                    aspects: card.Aspects,
                    traits: card.Traits,
                    arenas: card.Arenas,
                    keywords: card.Keywords,
                    artist: card.Artist,
                    set: card.Set,
                    number: card.Number,
                    id: String(card._id)
                }))
            });
        }

        // First, search for exact matches by Name (case-insensitive) and VariantType 'Normal'
        const exactMatches = await searchCardsExact(prompt);

        let foundCards = [];
        if (exactMatches.length > 0) {
            foundCards = exactMatches;
        } else {
            // Extract potential card names from the prompt for database search
            const words = (prompt || '').toLowerCase().split(/\s+/);
            const potentialCardNames = words.filter(word =>
                word.length > 2 &&
                !['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'].includes(word)
            );

            // Search for cards in the database (partial/phrase)
            const fullPhraseCards = await searchCards(prompt);
            foundCards = [...foundCards, ...fullPhraseCards];

            for (const term of potentialCardNames) {
                const cards = await searchCards(term);
                foundCards = [...foundCards, ...cards];
            }
        }

        // Remove duplicates based on unique document id (not by Name)
        const seenIds = new Set();
        const uniqueCards = foundCards.filter((card) => {
            const id = String(card._id);
            if (seenIds.has(id)) return false;
            seenIds.add(id);
            return true;
        });

        // Debug logging
        console.log(`Search prompt: "${prompt}"`);
        console.log(`Found ${uniqueCards.length} unique cards`);
        uniqueCards.forEach(card => {
            console.log(`- ${card.Name} (${card.Set}) #${card.Number}`);
        });

        // Apply pagination on the deduped results for fallback search
        const total = uniqueCards.length;
        const start = Math.min(skip, Math.max(0, total - 1));
        const paged = uniqueCards.slice(start, start + pageSize);

        res.json({
            page,
            pageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
            cards: paged.map(card => ({
                name: card.Name,
                type: card.Type,
                rarity: card.Rarity,
                cost: card.Cost,
                power: card.Power,
                hp: card.HP,
                frontText: card.FrontText,
                frontArt: card.FrontArt,
                aspects: card.Aspects,
                traits: card.Traits,
                arenas: card.Arenas,
                keywords: card.Keywords,
                artist: card.Artist,
                set: card.Set,
                number: card.Number,
                id: String(card._id)
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




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

app.get('/api/special', async (req, res) => {
    const set = req.query.set?.toUpperCase();
    try {
        const specialArr = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Normal', Rarity: 'Special' } },
            { $sample: { size: 1 } }
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
})

app.get('/api/legendary', async (req, res) => {
    const set = req.query.set?.toUpperCase();
    try {
        const legendaryArr = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Normal', Rarity: 'Legendary' } },
            { $sample: { size: 1 } }
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
})

app.get('/api/rare', async (req, res) => {
    const set = req.query.set?.toUpperCase();
    try {
        const rareArr = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Normal', Rarity: 'Rare' } },
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

app.get('/api/foil', async (req, res) => {
    const set = req.query.set?.toUpperCase();
    try {
        // Determine rarity based on odds (similar to leader endpoint)
        const random = Math.random();
        let foilRarity;

        if (random < 0.02) { // 2% chance for Legendary
            foilRarity = 'Legendary';
        } else if (random < 0.12) { // 10% chance for Special
            foilRarity = 'Special';
        } else if (random < 0.20) { // 8% chance for Rare
            foilRarity = 'Rare';
        } else if (random < 0.50) { // 30% chance for Uncommon
            foilRarity = 'Uncommon';
        } else { // 50% chance for Common
            foilRarity = 'Common';
        }

        const foilArr = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Hyperspace Foil', Rarity: foilRarity } },
            { $sample: { size: 1 } }
        ]);

        if (!foilArr.length) {
            // Fallback: if no cards found for selected rarity, try any foil card
            const fallbackFoilArr = await Card.aggregate([
                { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Hyperspace Foil' } },
                { $sample: { size: 1 } }
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
})

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

// React Router fallback
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});
