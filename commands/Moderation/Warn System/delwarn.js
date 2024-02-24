const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('delwarn')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDescription('Delete a warning')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('The user to unwarn')
        .setRequired(true))
    .addStringOption(opt => opt
        .setName('warning')
        .setAutocomplete(true)
        .setDescription('Warning text to delete')
        .setRequired(false)),
    autocomplete: async function(interaction, client) {
        
    },
    execute: async function (interaction, client) {
        const user = interaction.options.getMember('user');
        const warning = interaction.options.getString('warning');

        if (warning) {
            
        } else {
            const keys = await client.schemas.warnSchema.find({ Guild: interaction.guild.id, User: user.id });

            if (keys.length == 0) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> No warnings found for ${user.user.tag}`)], ephemeral: true });

            const embed = {
                title: `${user.user.tag} has ${keys.length} warning(s). Select one to delete.`,
                footer: {
                    text: 'Not all warnings are shown, use /delwarn to delete a specific warning.'
                },
                color: 0xf04a47
            }

            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`delwarn_${user.id}_${interaction.user.id}`)
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

            interaction.reply({ embeds: [embed], components: [row] });
        }
    }
}