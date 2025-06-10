const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CardSchema = new Schema({
    FrontArt: {
        type: String,
        required: false
    },
    Name: {
        type: String,
        required: true
    },
    Number: {
        type: String,
        required: false
    },
    Set: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('Card', CardSchema);