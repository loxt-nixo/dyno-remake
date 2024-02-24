const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Unute a member'),
    execute: async function (interaction) {

    }
}