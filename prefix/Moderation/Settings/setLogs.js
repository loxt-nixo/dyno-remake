const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'setlogs',
    description: 'Set the logs',
    aliases: [],
    execute: async function (msg, client, args) {
        const channel = msg.guild.channels.cache.get(args[0]) || msg.mentions.channels.first();

        if (!msg.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        let embed;

        if (!channel) {
            embed = {
                title: `Command: setlogs`,
                description: `Usage:\n?setlogs channel\n?setlogs #channel\n?setlogs channelid`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] });
        }

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: msg.guild.id });

        if (!guildConfig) {
            await client.schemas.GuildConfig.create({ Guild: msg.guild.id, Logs: channel.id });
        } else {
            guildConfig.Logs = channel.id;
            await guildConfig.save();
        }

        embed = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Logs Channel has been set to \`${channel.name}\``
        }

        msg.channel.send({ embeds: [embed] })
    }
}