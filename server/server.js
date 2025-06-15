require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Card = require('./models/Card')

// express app
const app = express()

app.use(express.json())

// routes
app.get('/leader', async (req, res) => {
    const findLeader = await Card.aggregate([
        { $match: { Type: 'Leader' } },
        { $sample: { size: 1 } }
    ]);
    const randomLeader = findLeader[0];
    res.json({ cardData: randomLeader });
})

app.get('/rare', async (req, res) => {
    const findRare = await Card.aggregate([
        {
            $match: {
                Type: { $ne: 'Leader' },
                Rarity: { $in: ['Rare', 'Legendary'] }
            }
        },
        { $sample: { size: 1 } }
    ]);
    const randomRare = findRare[0];
    res.json({ cardData: randomRare });
})

app.get('/uncommon', async (req, res) => {
    const findUncommonCard = await Card.aggregate([
        { $match: { Rarity: 'Uncommon' } },
        { $sample: { size: 1 } }
    ]);
    const randomUncommon = findUncommonCard[0];
    res.json({ cardData: randomUncommon });
})

app.get('/common', async (req, res) => {
    const findCommonCard = await Card.aggregate([
        {
            $match: {
                Type: { $nin: ['Leader', 'Base'] },
                Rarity: 'Common'
            }
        },
        { $sample: { size: 1 } }
    ]);
    const randomCommon = findCommonCard[0];
    res.json({ cardData: randomCommon });
})

app.post('/', async (req, res) => {
    const { FrontArt, Name, Number, Set } = req.body

    try {
        const card = await Card.create({ FrontArt, Name, Number, Set })
        res.status(200).json(card)
    } catch (error) {
        res.status(400).json({ error: error.message })
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


