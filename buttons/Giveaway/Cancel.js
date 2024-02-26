module.exports = {
    customID: 'giveaway-cancel',
    execute: async function (interaction, client, args) {
        const giveawayData = client.cache.get(`giveaway_${interaction.guild.id}_${args[0]}`);

        let embed;

        if (!giveawayData) {
            embed = {

            }

            return interaction.reply({  })
        } else {
            client.cache.delete(`giveaway_${interaction.guild.id}_${args[0]}`);
            embed = {

            }

            return interaction.reply({ embeds: [embed] })
        }
    }
}