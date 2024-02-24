const { Schema, model } = require('mongoose');

let warnShemaDyno = new Schema({
    Guild: String,
    User: String,
    Mod: String,
    Reason: String,
    WarnID: String,
    Date: Date,
})

module.exports = model('warnShemaDyno', warnShemaDyno);