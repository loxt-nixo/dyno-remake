const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warnings')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('Get warnings for a user')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to get warnings for')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');

        const keys = await client.schemas.warnSchema.find({ Guild: interaction.guild.id, User: user.id });

        if (keys.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:info:1205595965004972042> there are no warnings`)], ephemeral: true }); 

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
            .setCustomId(`delwarn_${user.id}_${interaction.user.id}`)
            .setLabel('Delete a warning')
            .setEmoji({ name: "🗑" })
            .setStyle(ButtonStyle.Danger)
        )

        interaction.reply({ embeds: [embed], components: [row] });
    }
}