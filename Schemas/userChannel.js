const { Schema, model } = require('mongoose');

let userChannel = new Schema({
    Guild: String,
    Category: String,
    Channel: String,
});

module.exports = model('userChannel123', userChannel);