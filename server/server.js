require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const Card = require('./models/Card')

// express app
const app = express()

app.use(express.json())

// routes
app.get('/', async (req, res) => {
    const myCard = (await Card.aggregate([{ $sample: { size: 1 } }]))[0];
    res.json({ mssg: myCard })
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


