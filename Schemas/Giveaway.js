const { Schema, model } = require('mongoose');

let Giveaway = new Schema({
    Guild: String,
    Channel: String,
    Creator: String,
    Message: String,
    Prize: String,
    EndsAt: Date,
    ID: String,
    Winners: Number,
    Entries: {
        type: Array,
        default: [],
    },
    Ended: {
        type: Boolean,
        default: false,
    }
});

module.exports = model('dynoGiveaway', Giveaway);