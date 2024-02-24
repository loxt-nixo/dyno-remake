const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'ban',
    description: 'Ban a member',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first()
        const reason = args.slice(1).join(' ');

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.BanMembers)) return;

        let embed;

        if (!user || !reason) {
            embed = {
                title: `Command: ban`,
                color: client.hexToInt(client.config.embedError),
                description: `Usage:\n?ban user reason\n?ban @user reason\n?ban userid reason`
            }

            return msg.channel.send({ embeds: [embed] })
        }

        if (user.bannable) {
            embed = {
                description: `<:success:1205124560622456832> ***${user.user.tag} was banned.***`,
                color: 0x43b582
            }
            await client.modLog(user, msg.member, msg.guild.id, 'Ban', reason, null);
            const dmEmbed = {
                color: client.hexToInt(client.config.embedError),
                description: `You were banned in ${msg.guild.name}`
            }

            user.send({ embeds: [dmEmbed] }).catch(() => {})
            user.ban({ reason: reason });
            msg.channel.send({ embeds: [embed] })
        } else {
            embed = {
                description: `<:error:1205124558638813194> I can't ban ${user.user.tag}`,
                color: client.hexToInt(client.config.embedError)
            }

            msg.channel.send({ embeds: [embed] })
        }
    }
}