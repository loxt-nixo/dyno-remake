const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clearnotes')
    .setDescription('Delete all notes for a member')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to clear notes for')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getUser('user');

        await client.schemas.noteSchema.deleteMany({ Guild: interaction.guild.id, User: user.id })

        let embed = {
            description: `<:success:1205124560622456832> Cleared all notes for ${user.tag}`,
            color: client.hexToInt(client.config.embedSuccess)
        }

        interaction.reply({ embeds: [embed] })
    }
}