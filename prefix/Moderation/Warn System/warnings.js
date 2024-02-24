const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'warnings',
    description: 'Get warnings for a user',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        if (!user) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setTitle('Command: warnings').setDescription(`Usage:\n?warnings user\n?warnings @user\n?warnings userid`)]})

        const keys = await client.schemas.warnSchema.find({ Guild: msg.guild.id, User: user.id });

        if (keys.length == 0) return msg.channel.send({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:info:1205595965004972042> there are no warnings`)], ephemeral: true }); 

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${keys.length} Warning(s) for ${user.user.tag} (${user.id})`, iconURL: user.displayAvatarURL() })
        .setColor(client.config.embedError)

        i = 0;

        for (const key of keys) {
            if (i == 25) continue;
            const mod = client.users.cache.get(key.Mod);
            embed.addFields({ name: `Moderator: ${mod.tag}`, value: `${key.Reason} - <t:${Math.floor(key.Date / 1000)}:R>`})
            i++;
        }

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`delwarn_${user.id}_${msg.author.id}`)
            .setLabel('Delete a warning')
            .setEmoji({ name: "🗑" })
            .setStyle(ButtonStyle.Danger)
        )

        msg.channel.send({ embeds: [embed], components: [row] });
    }
}