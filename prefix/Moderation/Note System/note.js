const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'note',
    description: '',
    aliases: [],
    execute: async function (msg, client, args) {

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first()
        const note = args.slice(1).join(' ');

        if (!user || !note) {
            let embed = {
                description: `Usage:\n?note user note\n?note @user sus\n?note userid sus`,
                title: `Command: note`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] })
        }

        const allData = await client.schemas.noteSchema.find({ Guild: msg.guild.id, User: user.id });

        if (allData.length > 10) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:success:1205124560622456832> User has too many notes. Delete one before adding another.`)], ephemeral: false });
        await client.schemas.noteSchema.create({ Guild: msg.guild.id, User: user.id, Note: note, Date: new Date(), Mod: msg.author.tag, NoteId: generateRandomCode(5) });
        msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription(`<:success:1205124560622456832> Note added for ${user.user.tag}.`)], ephemeral: false });
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