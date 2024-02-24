const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'kick',
    description: 'Kick a member',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first()
        const reason = args.slice(1).join(' ');

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.KickMembers)) return;

        let embed;

        if (!user || !reason) {
            embed = {
                title: `Command: kick`,
                color: client.hexToInt(client.config.embedError),
                description: `Usage:\n?kick user reason\n?kick @user reason\n?kick userid reason`
            }

            return msg.channel.send({ embeds: [embed] })
        }

        if (user.kickable) {
            embed = {
                description: `<:success:1205124560622456832> ***${user.user.tag} was kicked.***`,
                color: 0x43b582
            }
            await client.modLog(user, msg.member, msg.guild.id, 'Kick', reason, null);
            const dmEmbed = {
                color: client.hexToInt(client.config.embedError),
                description: `You were kicked from ${msg.guild.name}. | ${reason}`
            }
            user.send({ embeds: [dmEmbed] }).catch(() => {})
            user.kick({ reason: reason })
            msg.channel.send({ embeds: [embed] })
        } else {
            embed = {
                description: `<:error:1205124558638813194> I can't kick ${user.user.tag}`,
                color: client.hexToInt(client.config.embedError)
            }

            msg.channel.send({ embeds: [embed] })
        }
    }
}