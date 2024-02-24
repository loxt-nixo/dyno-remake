const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clearwarn',
    description: 'Clear warnings for a user',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        if (!user) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setTitle('Command: clearwarn').setDescription(`Usage:\n?clearwarn user\n?clearwarn @user\n?clearwarn userid`)]})

        const keys = await client.schemas.warnSchema.find({ Guild: msg.guild.id, User: user.id });

        if (keys.length == 0) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> No warnings found for ${user.user.tag}`)], ephemeral: true });

        await client.schemas.warnSchema.deleteMany({ Guild: msg.guild.id, User: user.id });

        msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription(`<:success:1205124560622456832> Cleared ${keys.length} warning(s) for ${user.user.tag}`)]})
    }
}