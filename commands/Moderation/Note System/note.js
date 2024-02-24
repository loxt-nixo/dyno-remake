const { SlashCommandBuilder, EmbedBuilder} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('note')
    .setDescription('Add note(s) about a member')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to note')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('text')
        .setDescription('Text to add as a note')
        .setRequired(true)),
    execute: async function (interaction, client) {
        const note = interaction.options.getString('text');
        const user = interaction.options.getMember('user');

        const allData = await client.schemas.noteSchema.find({ Guild: interaction.guild.id, User: user.id });

        if (allData.length > 10) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:success:1205124560622456832> User has too many notes. Delete one before adding another.`)], ephemeral: false });
        await client.schemas.noteSchema.create({ Guild: interaction.guild.id, User: user.id, Note: note, Date: new Date(), Mod: interaction.user.tag, NoteId: generateRandomCode(5) });
        interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription(`<:success:1205124560622456832> Note added for ${user.user.tag}.`)], ephemeral: false });
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