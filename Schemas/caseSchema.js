const { Schema, model } = require('mongoose');

let caseSchema = new Schema({
    Guild: String,
    User: String,
    Case: String,
    Type: String,
    Mod: String,
    Reason: String,
    Date: Date,
})

module.exports = model('caseSchema', caseSchema);