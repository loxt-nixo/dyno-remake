const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('notes')
    .setDescription('Get notes for a user')
    .addUserOption(option => option
        .setName('user')
        .setDescription('User to show notes for')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getUser('user');

        const allData = await client.schemas.noteSchema.find({ Guild: interaction.guild.id, User: user.id });

        if (allData.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(0x337fd5).setDescription(`<:info:1205595965004972042> There are no notes for this user.`)] });
        const embed = new EmbedBuilder().setColor("#e86b6b").setAuthor({ name: `Notes for ${user.tag} (${user.id})`, iconURL: user.displayAvatarURL() });
        for (const data of allData) {
            embed.addFields({ name: `Moderator: ${data.Mod}`, value: `${data.Note} - <t:${Math.floor(data.Date / 1000)}:R>` })
        }
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`noteDel_${user.id}_${interaction.user.id}`)
            .setStyle(ButtonStyle.Danger)
            .setLabel('Delete a Note')
            .setEmoji({ name: "🗑" })
        )
        interaction.reply({ embeds: [embed], components: [row] });
    }
}