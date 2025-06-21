require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Card = require('./models/Card')

// express app
const app = express()

app.use(express.json())

// routes
app.get('/leader', async (req, res) => {
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
        const randomLeader = leaderArr[0];
        res.json({ cardData: randomLeader });
    } catch (error) {
        console.error('Error fetching leader:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
})

app.get('/rare', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const legendaryChance = Math.random() < 0.2;
        const rareSlotRarity = legendaryChance ? 'Legendary' : 'Rare';

        const findRare = await Card.aggregate([
            { $match: { Set: set, Type: { $ne: 'Leader' }, VariantType: 'Normal', Rarity: rareSlotRarity } },
            { $sample: { size: 1 } }
        ]);
        const randomRare = findRare[0];
        res.json({ cardData: randomRare });
    } catch (error) {
        console.error('Error fetching rare card:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
})

app.get('/uncommon', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const findUncommonCard = await Card.aggregate([
            { $match: { Set: set, Rarity: 'Uncommon', VariantType: 'Normal', } },
            { $sample: { size: 1 } }
        ]);
        const randomUncommon = findUncommonCard[0];
        res.json({ cardData: randomUncommon });
    } catch (error) {
        console.error('Error fetching uncommon cards:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
})

app.get('/common', async (req, res) => {
    const set = req.query.set?.toUpperCase();

    try {
        const findCommonCard = await Card.aggregate([
            { $match: { Set: set, Type: { $nin: ['Leader', 'Base'] }, VariantType: 'Normal', Rarity: 'Common' } },
            { $sample: { size: 1 } }
        ]);
        const randomCommon = findCommonCard[0];
        res.json({ cardData: randomCommon });
    } catch (error) {
        console.error('Error fetching common cards:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
})

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log('Listening on port 3000...')
        });
    })
    .catch((error) => {
        console.log(error)
    })
