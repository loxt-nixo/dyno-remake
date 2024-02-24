const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    description: 'Get a users server/main avatar',
    aliases: [],
    execute: async function (msg, client, args) {
        let user, embed;

        switch (args[0]) {
            case 'get':
                user = msg.guild.members.cache.get(args[1]) || msg.mentions.members.first() || msg.member;
                embed = new EmbedBuilder()
                .setTitle('Server Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                msg.channel.send({ embeds: [embed] })
            break;
            case 'guild':
                user = msg.guild.members.cache.get(args[1]) || msg.mentions.members.first() || msg.member;
                const user2 = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first() || msg.author;
                if (user.displayAvatarURL() == user2.displayAvatarURL()) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> does not have a server avatar.`)], ephemeral: true });
                embed = new EmbedBuilder()
                .setTitle('Server Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                msg.channel.send({ embeds: [embed] })
            break;
            case 'user':
                user = msg.guild.members.cache.get(args[1]) || msg.mentions.members.first() || msg.author;
                embed = new EmbedBuilder()
                .setTitle('User Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                msg.channel.send({ embeds: [embed] })
            break;
            default:
                user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first() || msg.member;
                embed = new EmbedBuilder()
                .setTitle('Server Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                msg.channel.send({ embeds: [embed] })
            break;
        }
    }
}