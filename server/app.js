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

// Sort function for sorting cards in card search by set then number
function sortCards(cards) {
    const setOrder = ['SOR', 'SHD', 'TWI', 'JTL', 'LOF'];

    const normalizeSet = s => String(s || '').trim().toUpperCase();

    const getSetIndex = s => {
        const normalized = normalizeSet(s);
        const index = setOrder.indexOf(normalized);
        // Use a very large finite number instead of Infinity for more predictable comparisons
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    // Extract the first numeric portion of the card number (e.g. "001a" -> 1).
    // If no numeric portion, return a large number so "unknown" numbers sort last.
    const parseCardNumber = num => {
        if (num === null || num === undefined) return Number.MAX_SAFE_INTEGER;
        const str = String(num).trim();
        const m = str.match(/\d+/);     // first run of digits
        if (m) return parseInt(m[0], 10);
        const n = Number(str);
        return isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
    };

    return cards.sort((a, b) => {
        const aIndex = getSetIndex(a.Set);
        const bIndex = getSetIndex(b.Set);

        if (aIndex !== bIndex) return aIndex - bIndex;

        const aNum = parseCardNumber(a.Number);
        const bNum = parseCardNumber(b.Number);
        if (aNum !== bNum) return aNum - bNum;

        // Final deterministic tie-breaker: name (lexicographic)
        const aName = (a.Name || '').localeCompare(b.Name || '');
        return aName;
    });
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

        // helper to dedupe by _id for arrays of plain objects or mongoose docs
        const dedupeById = (arr) => {
            const seen = new Set();
            const out = [];
            for (const c of arr) {
                const id = String(c._id || c.id || c._id?.toString?.());
                if (!seen.has(id)) {
                    seen.add(id);
                    out.push(c);
                }
            }
            return out;
        };

        if (hasMeaningful) {
            // RANDOM sampling: leave as-is (we won't apply global sort to random sample)
            if (parsedFilter._random) {
                const match = { ...parsedFilter };
                delete match._random;
                const sampled = await Card.aggregate([
                    { $match: match },
                    { $sample: { size: parsedLimit || 1 } }
                ]);
                const total = sampled.length;
                return res.json({
                    page: 1,
                    pageSize: sampled.length,
                    total,
                    totalPages: 1,
                    cards: sampled.map(card => ({
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

            // Non-random parsed filter: fetch all matching documents, dedupe, sort, then paginate
            // NOTE: this fetches all matching docs to guarantee global sort order before pagination.
            const allResults = await Card.find(parsedFilter).lean().exec();
            const uniqueAll = dedupeById(allResults);

            console.log('Parsed filter hit. Prompt:', JSON.stringify(prompt), 'ParsedFilter:', parsedFilter, 'resultsBeforeDedup:', allResults.length, 'afterDedup:', uniqueAll.length);

            // sortCards from your file will normalize Set and parse numbers
            const sortedAll = sortCards(uniqueAll);

            // debug: show the set codes seen and a small sample before/after
            try {
                const normalizeSet = s => String(s || '').trim().toUpperCase();
                const uniqSets = [...new Set(uniqueAll.map(c => normalizeSet(c.Set)))];
                console.log('Unique sets (parsedFilter):', uniqSets);
                console.log('Sample sorted (first 10):', sortedAll.slice(0, 10).map(c => `${c.Set} #${c.Number} - ${c.Name}`));
            } catch (e) {
                console.warn('Debug logging failed:', e);
            }

            const total = sortedAll.length;
            const start = Math.min(skip, Math.max(0, total - 1));
            const paged = sortedAll.slice(start, start + pageSize);

            return res.json({
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
        }

        // --- fallback: exact match then tokenized / phrase search ---
        const exactMatches = await searchCardsExact(prompt);
        let foundCards = [];
        if (exactMatches.length > 0) {
            foundCards = exactMatches;
        } else {
            // Extract potential card names from the prompt for database search
            const words = (prompt || '').toLowerCase().split(/\s+/);
            const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must'];
            const potentialCardNames = words.filter(word => word.length > 2 && !stopWords.includes(word));

            // Search for cards in the database (partial/phrase)
            const fullPhraseCards = await searchCards(prompt);
            foundCards = [...foundCards, ...fullPhraseCards];

            for (const term of potentialCardNames) {
                const cardsForTerm = await searchCards(term);
                foundCards = [...foundCards, ...cardsForTerm];
            }
        }

        // Remove duplicates based on unique document id (not by Name)
        const uniqueCards = dedupeById(foundCards);

        // Debug logging
        console.log(`Search prompt: "${prompt}"`);
        console.log(`Found ${uniqueCards.length} unique cards (before sorting)`);
        uniqueCards.slice(0, 40).forEach(card => {
            console.log(`- ${card.Name} (${card.Set}) #${card.Number}`);
        });

        // Sort the results globally, then paginate
        const sortedCards = sortCards(uniqueCards);

        // debug: show sets seen in fallback path
        try {
            const normalizeSet = s => String(s || '').trim().toUpperCase();
            const uniqSets = [...new Set(uniqueCards.map(c => normalizeSet(c.Set)))];
            console.log('Unique sets (fallback):', uniqSets);
            console.log('Sample sorted (first 10 fallback):', sortedCards.slice(0, 10).map(c => `${c.Set} #${c.Number} - ${c.Name}`));
        } catch (e) {
            console.warn('Debug logging failed:', e);
        }

        const total = sortedCards.length;
        const start = Math.min(skip, Math.max(0, total - 1));
        const paged = sortedCards.slice(start, start + pageSize);

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
