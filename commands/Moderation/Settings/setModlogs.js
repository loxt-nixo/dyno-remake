const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setmodlogs')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Set the modlogs channel')
    .addChannelOption(opt => opt
        .setName('channel')
        .setDescription('The modlogs channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)),
    execute: async function (interaction, client) {
        const channel = interaction.options.getChannel('channel');

        let embed;

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: interaction.guild.id });

        if (!guildConfig) {
            await client.schemas.GuildConfig.create({ Guild: interaction.guild.id, ModLogs: channel.id });
        } else {
            guildConfig.ModLogs = channel.id;
            await guildConfig.save();
        }

        embed = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Modlgs Channel has been set to \`${channel.name}\``
        }

        interaction.reply({ embeds: [embed] })
    }
}