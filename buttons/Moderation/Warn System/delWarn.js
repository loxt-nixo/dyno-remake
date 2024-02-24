const { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
    customID: 'delwarn',
    execute: async function(interaction, client, args) {
            if (args[1] !== interaction.user.id) return;

            const user = await interaction.guild.members.fetch(args[0]);

            const keys = await client.schemas.warnSchema.find({ Guild: interaction.guild.id, User: args[0] });

            if (keys.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> No warnings found for ${user.user.tag}`)], ephemeral: true });

            const embed = {
                title: `${user.user.tag} has ${keys.length} warning(s). Select one to delete.`,
                footer: {
                    text: 'Not all warnings are shown, use /delwarn to delete a specific warning.'
                },
                color: 0xf04a47
            }

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`delwarn_${args[0]}_${interaction.user.id}`)
                .setPlaceholder('Select a warning to delete')
                .setMaxValues(1)
                .setMinValues(1)

            i = 0;

            for (const key of keys) {
                if (i == 25) continue;
                selectMenu.addOptions(
                    new StringSelectMenuOptionBuilder()
                    .setValue(key.WarnID)
                    .setLabel(`${key.Reason} - ${key.Date.getDate()}/${key.Date.getMonth() + 1}/${key.Date.getFullYear()}`)
                )
                i++;
            }

            const row = new ActionRowBuilder() .addComponents(selectMenu)

            interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
}