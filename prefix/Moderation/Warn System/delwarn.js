const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')

module.exports = {
    name: 'delwarn',
    description: '',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        if (!user) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setTitle('Command: delwarn').setDescription(`Usage:\n?delwarn user\n?delwarn @user\n?delwarn userid`)]})

        const keys = await client.schemas.warnSchema.find({ Guild: msg.guild.id, User: user.id });

        if (keys.length == 0) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> No warnings found for ${user.user.tag}`)], ephemeral: true });

        const embed = {
            title: `${user.user.tag} has ${keys.length} warning(s). Select one to delete.`,
            footer: {
                text: 'Not all warnings are shown, use /delwarn to delete a specific warning.'
            },
            color: 0xf04a47
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`delwarn_${user.id}_${msg.author.id}`)
            .setPlaceholder('Select a warning to delete')
            .setMaxValues(1)
            .setMinValues(1)

        i = 0;

        for (const key of keys) {
            if (i == 25) continue;
            selectMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                .setValue(key.WarnID)
                .setLabel(`${key.Reason} - ${key.Date.getDate()}/${key.Date.getMonth() + 1}/${key.Date.getFullYear()}`)
            )
            i++;
        }

        const row = new ActionRowBuilder().addComponents(selectMenu)

        msg.channel.send({ embeds: [embed], components: [row] });
    }
}