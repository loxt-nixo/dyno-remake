const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDescription('Ban a member')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to ban')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('reason')
        .setDescription('Reason for the ban')
        .setRequired(false)),
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || '*No reason specified.*';

        const modCheck = await client.checkMod(interaction.member._roles, interaction.guild.id);

        if (!modCheck && !interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return;

        let embed;

        if (user.bannable) {
            embed = {
                description: `<:success:1205124560622456832> ***${user.user.tag} was banned.***`,
                color: 0x43b582
            }
            await client.modLog(user, interaction.member, interaction.guild.id, 'Ban', reason, null);
            const dmEmbed = {
                color: client.hexToInt(client.config.embedError),
                description: `You were banned in ${interaction.guild.name}`
            }
    
            user.send({ embeds: [dmEmbed] }).catch(() => {})
            user.ban({ reason: reason });
            interaction.reply({ embeds: [embed] })
        } else {
            embed = {
                description: `<:error:1205124558638813194> I can't ban ${user.user.tag}`,
                color: client.hexToInt(client.config.embedError)
            }

            interaction.reply({ embeds: [embed], ephemeral: true })
        }
    }
}