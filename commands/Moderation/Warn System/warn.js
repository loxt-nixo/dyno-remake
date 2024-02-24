const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('reason')
        .setDescription('The reason for the warn')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');

        const embed = {
            description: `<:success:1205124560622456832> ***${user.user.tag} has been warned.***`,
            color: 0x43b582
        }

        await client.schemas.warnSchema.create({ Guild: interaction.guild.id, User: user.id, WarnID: generateRandomCode(5), Mod: interaction.user.id, Reason: reason, Date: Date.now() });

        interaction.reply({ embeds: [embed] });

        const dmEmbed = {
            color: client.hexToInt(client.config.embedError),
            description: `You were warned in ${interaction.guild.name} for ${reason}`
        }

        const dmButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setDisabled(true)
            .setLabel(`Message from server: ${interaction.guild.name}`)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('dmButton')
        )

        await client.modLog(user, interaction.member, interaction.guild.id, 'Warn', reason, null)

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