const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delnote')
    .setDescription('Delete a note about a member')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to delete note for')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getUser('user');

        const data = await client.schemas.noteSchema.find({ Guild: interaction.guild.id, User: user.id });

        if (data.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x337fd5).setDescription(`<:info:1205595965004972042> There are no notes for this user.`)], ephemeral: false });

        const embed = new EmbedBuilder().setTitle(`${user.tag} has ${data.length} notes. Select one to delete.`).setColor(client.config.embedError)
        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`noteDel_${user.id}_${interaction.user.id}`)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder('Select a note to delete!')

        for (const key of data) {
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                .setValue(key.NoteId)
                .setLabel(`${key.Note} - ${key.Date.getDate()}/${key.Date.getMonth() + 1}/${key.Date.getFullYear()}`)
            )
        }

        const row = new ActionRowBuilder().addComponents(selectMenu)

        interaction.reply({ embeds: [embed], components: [row], ephemeral: false });
    }
}