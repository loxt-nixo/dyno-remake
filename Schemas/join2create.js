const { Schema, model } = require('mongoose');

let join2create = new Schema({
    Guild: String,
    Category: String,
    Channel: String,
});

module.exports = model('join2create123', join2create);