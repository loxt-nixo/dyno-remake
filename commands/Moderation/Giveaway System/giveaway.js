const { SlashCommandBuilder, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Giveaway system')
    .addSubcommand(sub => sub
        .setName('create')
        .setDescription('Create a new giveaway.')
        .addChannelOption(opt => opt
            .setName('channel')
            .setDescription('Channel to create the giveaway in')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true))
        .addIntegerOption(opt => opt
            .setName('winners')
            .setDescription('Number of winners')
            .setMinValue(1)
            .setMaxValue(10)
            .setRequired(true))
        .addStringOption(opt => opt
            .setName('duration')
            .setDescription('Duration of the giveaway')
            .setRequired(true))
        .addStringOption(opt => opt
            .setName('name')
            .setDescription('Title of the giveaway (prize)')
            .setRequired(true)))
    .addSubcommand(sub => sub
        .setName('reroll')
        .setDescription('Rolls an new winner for an ended giveaway.')
        .addStringOption(opt => opt
            .setName('message')
            .setDescription('Message ID/link')
            .setRequired(true)))
    .addSubcommand(sub => sub
        .setName('end')
        .setDescription('Immediately end a giveaway.')
        .addStringOption(opt => opt
            .setName('message')
            .setDescription('Message ID/link')
            .setRequired(true))),
    execute: async function (interaction, client) {
        const sub = interaction.options.getSubcommand();

        let messageId = interaction.options.getString('message');
        if (messageId && messageId.startsWith('https://')) {
            messageId = messageId.split('/');
            for (let i = 0; i < 6; i++) {
                messageId.shift();
            }
        }

        const channel = interaction.options.getChannel('channel');
        const winners = interaction.options.getInteger('winners');
        const duration = interaction.options.getString('duration');
        const giveawayName = interaction.options.getString('name');

        let embed;

        switch (sub) {
            case 'create':
                const durationMs = ms(duration);

                if (!durationMs) {
                    embed = new EmbedBuilder()
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }

                embed = new EmbedBuilder()
                .setColor(0x337fd5)
                .setTitle(giveawayName)
                .addFields(
                    { name: `Time Remaining`, value: `**${await formatUnix((Date.now() + durationMs) / 1000)}**`, inline: true },
                    { name: `Hosted By`, value: `${interaction.user}`, inline: true },
                )
                .setFooter({ text: `${winners} Winners | Ends At` })
                .setTimestamp(Date.now() + durationMs)

                const giveawayId = generateRandomCode(5);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setCustomId(`giveaway-create_${giveawayId}`)
                    .setLabel('Start')
                    //.setEmoji({ id: "1211285332474204241" }),
                    .setEmoji({ id: "1211300489266991164" }),
                    new ButtonBuilder()
                    //.setEmoji({ id: "1211285334525214810" })
                    .setEmoji({ id: "1211300486934822914" })
                    .setCustomId(`giveaway-cancel_${giveawayId}`)
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger)
                )

                client.cache.set(`giveaway_${interaction.guild.id}_${giveawayId}`, {
                    channel: channel,
                    duration: durationMs,
                    name: giveawayName,
                    winners: winners,
                    creator: interaction.user.id
                });

                interaction.reply({ embeds: [embed], components: [row] })
            break;
            case 'reroll':
                let rerollData;
                if (Array.isArray(messageId)) {
                    rerollData = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, Message: messageId[0] });
                } else {
                    rerollData = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, Message: messageId });
                }

                if (!rerollData) {
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription('<:error:1205124558638813194> Please enter a valid message ID/link.')], ephemeral: true })
                }

                if (!rerollData.Ended) {
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription('<:error:1205124558638813194> Giveaway has not ended!')] });
                }

                const rerollChannel = client.channels.cache.get(rerollData.Channel);

                const newWinners = selectWinners(rerollData.Entries, rerollData.Winners);
                const text = newWinners.map(winner => `<@${winner}>`).join(', ');
                rerollChannel.send({ content: `Congratulations ${text}, you won ${rerollData.Prize}!` });

                interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription('<:success:1205124560622456832> Giveaway rerolled!')], ephemeral: true });
            break;
            case 'end':
                let endData;
                if (Array.isArray(messageId)) {
                    endData = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, Message: messageId[0] });
                } else {
                    endData = await client.schemas.Giveaway.findOne({ Guild: interaction.guild.id, Message: messageId });
                }

                if (!endData) {
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription('<:error:1205124558638813194> Please enter a valid message ID/link.')], ephemeral: true })
                }

                if (endData.Ended) {
                    return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription('<:error:1205124558638813194> Giveaway has already ended!')] });
                }

                endData.EndsAt = Date.now();
                await endData.save();

                interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedSuccess).setDescription('<:success:1205124560622456832> Giveaway ended!')], ephemeral: true });
            break;
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

async function formatUnix(unix) {
    const timestampMoment = moment.unix(unix);

    const duration = moment.duration(timestampMoment.diff(moment()));
    
    const years = Math.abs(duration.years());
    const months = Math.abs(duration.months());
    const weeks = Math.abs(duration.weeks());
    const days = Math.abs(duration.days());
    const hours = Math.abs(duration.hours());
    const minutes = Math.abs(duration.minutes());
    const seconds = Math.abs(duration.seconds());

    if (years > 0) {
        return `${years} years, ${months} months`
    } else if (months > 0) {
        return `${months} months, ${weeks} weeks`
    } else if (weeks > 0) {
        return `${weeks} weeks, ${days} days`
    } else if (days > 0) {
        return `${days} days, ${hours} hours`
    } else if (hours > 0) {
        return `${hours} hours, ${minutes} mins`
    } else if (minutes > 0) {
        return `${minutes} mins, ${seconds} secs `
    } else {
        return `${seconds} secs`
    }
}

function selectWinners(participants, count) {
    for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
    }
    return participants.slice(0, count);
}