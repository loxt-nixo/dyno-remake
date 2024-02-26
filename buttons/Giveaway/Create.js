const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    customID: 'giveaway-create',
    execute: async function (interaction, client, args) {
        const giveawayData = client.cache.get(`giveaway_${interaction.guild.id}_${args[0]}`);

        if (!giveawayData) {
            console.log('NO DATA');
            interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> Please rerun the giveaway create command!`)] });
            return;
        }

        const embed = new EmbedBuilder()
        .setColor(0x337fd5)
        .setTitle(giveawayData.name)
        .addFields(
            { name: `Time Remaining`, value: `**<t:${Math.floor((Date.now() + giveawayData.duration) / 1000)}:R>**`, inline: true },
            { name: `Hosted By`, value: `${interaction.user}`, inline: true },
        )
        .setFooter({ text: `${giveawayData.winners} Winners | Ends At` })
        .setTimestamp(Date.now() + giveawayData.duration);

        const giveawayButtons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`giveaway-join_${args[0]}`)
            .setLabel('Enter')
            .setEmoji({ name: "🎉" })
            .setStyle(ButtonStyle.Success)
        )

        const msg = await giveawayData.channel.send({ embeds: [embed], components: [giveawayButtons] }).catch(() => {});

        await client.schemas.Giveaway.create({
            Guild: interaction.guild.id,
            Message: msg.id,
            Creator: giveawayData.creator,
            Channel: giveawayData.channel.id,
            Winners: giveawayData.winners,
            Prize: giveawayData.name,
            EndsAt: Date.now() + giveawayData.duration,
            ID: args[0],
        });

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setCustomId(`giveaway-create_${args[0]}`)
            .setLabel('Start')
            .setDisabled(true)
            //.setEmoji({ id: "1211285332474204241" }),
            .setEmoji({ id: "1211300489266991164" }),
            new ButtonBuilder()
            //.setEmoji({ id: "1211285334525214810" })
            .setEmoji({ id: "1211300486934822914" })
            .setCustomId(`giveaway-cancel_${args[0]}`)
            .setLabel('Cancel')
            .setDisabled(true)
            .setStyle(ButtonStyle.Danger)
        )

        interaction.update({ content: `The giveaway was started in ${giveawayData.channel}.`, embeds: [], components: [row] })
    }
}