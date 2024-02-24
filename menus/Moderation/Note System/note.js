const { EmbedBuilder } = require('discord.js');

module.exports = {
    customID: 'noteDel',
    execute: async function(interaction, client, args) {
        if (args[1] !== interaction.user.id) return;
        const user = client.users.cache.get(args[0]);
        const noteId = interaction.values[0];
        const data = await client.schemas.noteSchema.findOne({ Guild: interaction.guild.id, User: user.id, NoteId: noteId });
        if (!data) return interaction.reply({ content: 'Note not found!', ephemeral: true });
        await client.schemas.noteSchema.deleteOne({ Guild: interaction.guild.id, User: user.id, NoteId: noteId });
        interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription(`<:success:1205124560622456832> Deleted note \`${data.Note}\` for ${user.tag}`)], ephemeral: true });
    }}