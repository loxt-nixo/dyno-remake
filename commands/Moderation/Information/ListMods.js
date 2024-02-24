const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('listmods')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('list Moderators.'),
    execute: async function (interaction, client) {
        await interaction.deferReply()
        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: interaction.guild.id });

        let embed;

        if (!guildConfig) {
            embed = {
                color: 0x337fd5,
                description: `<:info:1205595965004972042> There are no moderator roles. Add one using \`/addmod role\``
            }

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        if (guildConfig.ModRoles.length == 0) {
            embed = {
                color: 0x337fd5,
                description: `<:info:1205595965004972042> There are no moderator roles. Add one using \`/addmod role\``
            }

            return interaction.editReply({ embeds: [embed], ephemeral: true });
        }

        embed = {
            description: `${guildConfig.ModRoles.map(role => { return `<@&${role}>`} ).join('\n')}`,
            color: 0x337fd5,
            title: `Moderator Roles`
        }

        interaction.editReply({ embeds: [embed] })
    }
}