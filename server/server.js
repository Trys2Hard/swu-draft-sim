require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Card = require('./models/Card')

// express app
const app = express()

app.use(express.json())

// routes
app.get('/leader', async (req, res) => {
    try {
        const rareLeaderChance = Math.random() < 0.2;
        const leaderRarity = rareLeaderChance ? 'Rare' : 'Common';

        const leaderArr = await Card.aggregate([
            { $match: { Type: 'Leader', Rarity: leaderRarity } },
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
    try {
        const legendaryChance = Math.random() < 0.2;
        const rareSlotRarity = legendaryChance ? 'Legendary' : 'Rare';

        const findRare = await Card.aggregate([
            { $match: { Type: { $ne: 'Leader' }, Rarity: rareSlotRarity } },
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
    try {
        const findUncommonCard = await Card.aggregate([
            { $match: { Rarity: 'Uncommon' } },
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
    try {
        const findCommonCard = await Card.aggregate([
            { $match: { Type: { $nin: ['Leader', 'Base'] }, Rarity: 'Common' } },
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
