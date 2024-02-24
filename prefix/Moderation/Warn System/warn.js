const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'warn',
    description: 'Warn a member',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first()
        const reason = args.slice(1).join(' ');

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const invalidArgs = {
            title: `Command: Warn`,
            description: `Usage:\n?warn user reason\n?warn @user spam\n?warn userid spam`,
            color: client.hexToInt(client.config.embedError)
        }

        if (!user || !reason) return msg.channel.send({ embeds: [invalidArgs] })

        const embed = {
            description: `<:success:1205124560622456832> ***${user.user.tag} has been warned.***`,
            color: 0x43b582
        }

        await client.schemas.warnSchema.create({ Guild: msg.guild.id, User: user.id, WarnID: generateRandomCode(5), Mod: msg.author.id, Reason: reason, Date: Date.now() });

        msg.channel.send({ embeds: [embed] });

        const dmEmbed = {
            color: client.hexToInt(client.config.embedError),
            description: `You were warned in ${msg.guild.name} for ${reason}`
        }

        const dmButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setDisabled(true)
            .setLabel(`Message from server: ${msg.guild.name}`)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('dmButton')
        )

        await client.modLog(user, msg.member, msg.guild.id, 'Warn', reason, null)

        try {
            user.send({ embeds: [dmEmbed], components: [dmButton] })
        } catch (error) {
            return;
        }
    }
}

function generateRandomCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}