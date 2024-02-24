const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'notes',
    description: 'Get notes for a user',
    aliases: [],
    execute: async function (msg, client, args) {

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        if (!user) {
            let embed = {
                description: `Usage:\n?notes user\n?notes @user\n?notes userid`,
                title: `Command: notes`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] })
        }

        const allData = await client.schemas.noteSchema.find({ Guild: msg.guild.id, User: user.id });

        if (allData.length == 0) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(0x337fd5).setDescription(`<:info:1205595965004972042> There are no notes for this user.`)] });
        const embed = new EmbedBuilder().setColor("#e86b6b").setAuthor({ name: `Notes for ${user.user.tag} (${user.user.id})`, iconURL: user.user.displayAvatarURL() });
        for (const data of allData) {
            embed.addFields({ name: `Moderator: ${data.Mod}`, value: `${data.Note} - <t:${Math.floor(data.Date / 1000)}:R>` })
        }
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`noteDel_${user.user.id}_${msg.author.id}`)
            .setStyle(ButtonStyle.Danger)
            .setLabel('Delete a Note')
            .setEmoji({ name: "🗑" })
        )
        msg.channel.send({ embeds: [embed], components: [row] });
    }
}