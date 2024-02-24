const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setnick')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('Change the nickname of a user')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to change nickname for')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('nickname')
        .setDescription('New nickname for the user')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');
        const nick = interaction.options.getString('nickname');

        const invalidArgs = {
            title: 'Command: setnick',
            description: `Usage:\n?setnick user new nickname\n?setnick @user bad nickname`,
            color: client.hexToInt(client.config.embedError)
        }

        if (!user || !nick) return interaction.reply({ embeds: [invalidArgs], ephemeral: true });

        const cantChange = {
            color: client.hexToInt(client.config.embedError),
            description: `<:error:1205124558638813194> Unable to change nickname for ${user.user.tag}.`
        }

        if (!user.manageable) return interaction.reply({ embeds: [cantChange], ephemeral: true });

        user.setNickname(nick);

        const nickSet = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Nickname set.`
        }

        interaction.reply({ embeds: [nickSet] });
    }
}