const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('Clear warnings for a user')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to clear warnings for')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');

        const keys = await client.schemas.warnSchema.find({ Guild: interaction.guild.id, User: user.id });

        if (keys.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> No warnings found for ${user.user.tag}`)], ephemeral: true });

        await client.schemas.warnSchema.deleteMany({ Guild: interaction.guild.id, User: user.id });

        interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription(`<:success:1205124560622456832> Cleared ${keys.length} warning(s) for ${user.user.tag}`)]})
    }
}