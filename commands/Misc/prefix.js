const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('prefix')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('Set/get the prefix for this server')
    .addStringOption(opt => opt
        .setName('prefix')
        .setDescription('The new prefix Ex ! . /')
        .setRequired(false)),
    execute: async function (interaction, client) {
        const prefix = interaction.options.getString('prefix');

        let embed;

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: interaction.guild.id });

        if (!prefix) {
            embed = {
                description: `<:info:1205595965004972042> The prefix for this server is \`${guildConfig.Prefix ? guildConfig.Prefix : client.config.prefix}\``,
                color: 0x337fd5
            }

            interaction.reply({ embeds: [embed] });
        } else {
            if (guildConfig) {
                guildConfig.Prefix = prefix;
                await guildConfig.save()
            } else {
                await client.schemas.GuildConfig.create({ Guild: interaction.guild.id, Prefix: prefix });
            }

            client.cache.set(`prefix_${interaction.guild.id}`, prefix);

            embed = {
                description: `<:success:1205124560622456832> Changed server prefix to \`${prefix}\``,
                color: client.hexToInt(client.config.embedSuccess)
            }

            interaction.reply({ embeds: [embed] });
        }
    }
}