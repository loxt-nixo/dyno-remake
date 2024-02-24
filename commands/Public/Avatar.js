const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Avatar')
    .addSubcommand(sub => sub
        .setName('get')
        .setDescription('Gets a users avatar')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('User to fetch avatar from')
            .setRequired(false)))
    .addSubcommand(sub => sub
        .setName('guild')
        .setDescription('Gets a users guild avatar, if they have one')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('User to fetch avatar from')
            .setRequired(false)))
    .addSubcommand(sub => sub
        .setName('user')
        .setDescription('Gets a users main avatar')
        .addUserOption(opt => opt
            .setName('user')
            .setDescription('User to fetch avatar from')
            .setRequired(false))),
    execute: async function (interaction, client) {
        const sub = interaction.options.getSubcommand()

        let user, embed;

        switch (sub) {
            case 'get':
                user = interaction.options.getMember('user') || interaction.member;
                embed = new EmbedBuilder()
                .setTitle('Server Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
            case 'guild':
                user = interaction.options.getMember('user') || interaction.member;
                const user2 = interaction.options.getUser('user') || interaction.user;
                if (user.displayAvatarURL() == user2.displayAvatarURL()) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> does not have a server avatar.`)], ephemeral: true });
                embed = new EmbedBuilder()
                .setTitle('Server Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
            case 'user':
                user = interaction.options.getUser('user') || interaction.user;
                embed = new EmbedBuilder()
                .setTitle('User Avatar')
                .setImage(user.displayAvatarURL({ size: 4096 }))
                .setAuthor({ name: `${user.tag}`, iconURL: user.displayAvatarURL() })
                interaction.reply({ embeds: [embed] })
            break;
        }
    }
}