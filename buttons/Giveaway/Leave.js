module.exports = {
    customID: 'giveaway-leave',
    execute: async function(interaction, client, args) {
        const data = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, ID: args[0] });

        let embed;

        if (data.Ended) {
            embed = {
                description: `<:error:1205124558638813194> That giveaway has already ended.`,
                color: client.hexToInt(client.config.embedError)
            }
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!data.Entries.includes(interaction.user.id)) {
            embed = {
                description: `<:error:1205124558638813194> You did not enter the giveaway,`,
                color: client.hexToInt(client.config.embedError)
            }
            return interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
            data.Entries = data.Entries.filter(item => item !== interaction.user.id);
            await data.save();
            embed = {
                description: `<:success:1205124560622456832> Giveaway left.`,
                color: client.hexToInt(client.config.embedSuccess)
            }
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}