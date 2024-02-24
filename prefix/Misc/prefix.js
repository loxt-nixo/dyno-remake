const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'prefix',
    description: 'Set/get the prefix for this server',
    aliases: [],
    execute: async function (msg, client, args) {
        const prefix = args[0];

        if (!msg.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        let embed;

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: msg.guild.id });

        if (!prefix) {
            embed = {
                description: `<:info:1205595965004972042> The prefix for this server is \`${guildConfig.Prefix ? guildConfig.Prefix : client.config.prefix}\``,
                color: 0x337fd5
            }

            msg.channel.send({ embeds: [embed] });
        } else {
            if (guildConfig) {
                guildConfig.Prefix = prefix;
                await guildConfig.save()
            } else {
                await client.schemas.GuildConfig.create({ Guild: msg.guild.id, Prefix: prefix });
            }

            client.cache.set(`prefix_${msg.guild.id}`, prefix);

            embed = {
                description: `<:success:1205124560622456832> Changed server prefix to \`${prefix}\``,
                color: client.hexToInt(client.config.embedSuccess)
            }

            msg.channel.send({ embeds: [embed] });
        }
    }
}