const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a member'),
    execute: async function (interaction) {

    }
}