module.exports = {
    customID: 'delwarn',
    execute: async function(interaction, client, args) {
        if (args[1] !== interaction.user.id) return;

        const id = interaction.values[0];

        const user = await interaction.guild.members.fetch(args[0]);

        const warnInfo = await client.schemas.warnSchema.findOne({ Guild: interaction.guild.id, User: args[0], WarnID: id });

        const notFound = {
            description: `<:error:1205124558638813194> No warning found!`,
            color: client.hexToInt(client.config.embedError)
        }

        if (!warnInfo) return interaction.reply({ embeds: [notFound], ephemeral: true });

        await client.schemas.warnSchema.deleteOne({ Guild: interaction.guild.id, User: args[0], WarnID: id });

        const embed = {
            description: `<:success:1205124560622456832> Deleted warning \`${warnInfo.Reason}\` for ${user.user.tag}`,
            color: client.hexToInt(client.config.embedSuccess)
        }

        interaction.reply({ embeds: [embed], ephemeral: true });
    }
}