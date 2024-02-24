const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'setmodlogs',
    description: 'Set the Mod Logs',
    aliases: [],
    execute: async function (msg, client, args) {
        const channel = msg.guild.channels.cache.get(args[0]) || msg.mentions.channels.first();

        if (!msg.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        let embed;

        if (!channel) {
            embed = {
                title: `Command: setmodlogs`,
                description: `Usage:\n?setmodlogs channel\n?setmodlogs #channel\n?setmodlogs channelid`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] });
        }

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: msg.guild.id });

        if (!guildConfig) {
            await client.schemas.GuildConfig.create({ Guild: msg.guild.id, ModLogs: channel.id });
        } else {
            guildConfig.ModLogs = channel.id;
            await guildConfig.save();
        }

        embed = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Modlgs Channel has been set to \`${channel.name}\``
        }

        msg.channel.send({ embeds: [embed] })
    }
}