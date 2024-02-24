const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    name: 'delnote',
    description: 'Delete a note about a member',
    aliases: [],
    execute: async function (msg, client, args) {

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        if (!user) {
            let embed = {
                description: `Usage:\n?delnote user\n?delnote @user\n?delnote userid`,
                title: `Command: notes`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] })
        }

        const data = await client.schemas.noteSchema.find({ Guild: msg.guild.id, User: user.id });

        if (data.length == 0) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(0x337fd5).setDescription(`<:info:1205595965004972042> There are no notes for this user.`)] });

        const embed = new EmbedBuilder().setTitle(`${user.user.tag} has ${data.length} notes. Select one to delete.`).setColor(client.config.embedError)
        const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`noteDel_${user.id}_${msg.author.id}`)
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder('Select a note to delete!')

        for (const key of data) {
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                .setValue(key.NoteId)
                .setLabel(`${key.Note} - ${key.Date.getDate()}/${key.Date.getMonth() + 1}/${key.Date.getFullYear()}`)
            )
        }

        const row = new ActionRowBuilder().addComponents(selectMenu)

        msg.channel.send({ embeds: [embed], components: [row] });
    }
}