const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('addmod')
    .setDescription('Add a moderator role')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption(opt => opt
        .setName('role')
        .setDescription('Role to add as a mod')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const role = interaction.options.getRole('role');

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: interaction.guild.id });

        let embed;

        if (guildConfig && guildConfig.ModRoles.includes(role.id)) {

            embed = {
                description: `<:error:1205124558638813194> That role already has moderator permissions`,
                color: client.hexToInt(client.config.embedError)
            }
            
            interaction.reply({ embeds: [embed], ephemeral: true })
        } else if (guildConfig && !guildConfig.ModRoles.includes(role.id)) {
            guildConfig.ModRoles.push(role.id);

            await guildConfig.save();

            embed = {
                description: `<:success:1205124560622456832> Users in role \`${role.name}\` now have moderator permissions`,
                color: client.hexToInt(client.config.embedSuccess)
            }

            interaction.reply({ embeds: [embed] })
        } else {
            await client.schemas.GuildConfig.create({ Guild: interaction.guild.id, ModRoles: [`${role.id}`] });

            embed = {
                description: `<:success:1205124560622456832> Users in role \`${role.name}\` now have moderator permissions`,
                color: client.hexToInt(client.config.embedSuccess)
            }

            interaction.reply({ embeds: [embed] })
        }
    }
}