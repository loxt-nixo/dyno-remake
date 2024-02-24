const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setlogs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Set the logs channel')
    .addChannelOption(opt => opt
        .setName('channel')
        .setDescription('The logs channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)),
    execute: async function (interaction, client) {
        const channel = interaction.options.getChannel('channel');

        let embed;

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: interaction.guild.id });

        if (!guildConfig) {
            await client.schemas.GuildConfig.create({ Guild: interaction.guild.id, Logs: channel.id });
        } else {
            guildConfig.Logs = channel.id;
            await guildConfig.save();
        }

        embed = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Logs Channel has been set to \`${channel.name}\``
        }

        interaction.reply({ embeds: [embed] })
    }
}