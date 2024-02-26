const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customID: 'giveaway-join',
    execute: async function (interaction, client, args) {
        const data = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, ID: args[0] });

        let embed;

        if (data.Ended) {
            embed = {
                description: `<:error:1205124558638813194> That giveaway has already ended.`,
                color: client.hexToInt(client.config.embedError)
            }
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (data.Entries.includes(interaction.user.id)) {
            embed = {
                color: client.hexToInt(client.config.embedError),
                description: `<:error:1205124558638813194> You have already entered this giveaway.`
            }
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`giveaway-leave_${args[0]}`)
                .setLabel('Leave')
                //.setEmoji({ id: "" })
            )
            return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
        } else {
            data.Entries.push(interaction.user.id);
            await data.save();
            embed = {
                description: `<:success:1205124560622456832> Giveaway entered.`,
                color: client.hexToInt(client.config.embedSuccess)
            };
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}