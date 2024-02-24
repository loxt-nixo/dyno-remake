const { Schema, model } = require('mongoose');

let guildConfigDyno = new Schema({
    Guild: {
        type: String,
        required: true,
    },
    Prefix: {
        type: String,
        default: null,
    },
    ModLogs: {
        type: String,
        default: null,
    },
    Logs: {
        type: String,
        default: null,
    },
    ModRoles: {
        type: Array,
        default: [],
    },
});

module.exports = model('guildConfigDyno', guildConfigDyno);