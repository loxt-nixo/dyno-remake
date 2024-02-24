const { Schema, model } = require('mongoose');

let noteSchema = new Schema({
    Guild: String,
    User: String,
    Mod: String,
    Note: String,
    NoteId: String,
    Date: Date,
})

module.exports = model('noteSchema', noteSchema);