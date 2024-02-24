require('./utils/ProcessHandlers.js')();

const { Client, ActivityType, EmbedBuilder, Events } = require('discord.js');
const mongoose = require('mongoose');
const moment = require('moment');

const client = new Client({
    intents: [
        'Guilds',
        'GuildMembers',
        'MessageContent',
        'GuildMessages',
        'GuildVoiceStates',
        'GuildBans',
        'GuildEmojisAndStickers'
    ],
    partials: [
        'GuildMembers',
        'Messages',
    ]
});

//client.db = db;
client.hexToInt = function hexColorToInt(hexColor) {
    if (hexColor.startsWith("#")) {
        hexColor = hexColor.substring(1);
    }
    let decimalColor = parseInt(hexColor, 16);
    
    return decimalColor;
}
client.checkMod = async function checkMod(roles, guild) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: guild });

    if (!guildConfig) {
        return false;
    }

    if (guildConfig.ModRoles.length == 0) {
        return false;
    }

    if (roles.some(role => guildConfig.ModRoles.includes(role))) {
        return true;
    } else {
        return false;
    }
}
client.modLog = async function(user, mod, guild, action, reason, length) {
    actionColors = {
        "Warn": "#fadb5e",
        "Mute": "#ff470f",
        "Ban": "#f04a47",
        "Kick": "#f04a47",
    }
    const embed = new EmbedBuilder()
    .setColor(actionColors[action] || "#fadb5e")
    .setAuthor({ name: `${action} | ${user.user.tag}`, iconURL: user.user.displayAvatarURL() })
    .addFields(
            { name: `User`, value: `${user}`, inline: true },
            { name: `Moderator`, value: `${mod}`, inline: true },
            { name: `Reason`, value: `${reason}`, inline: true }
        )
    .setFooter({ text: `ID: ${user.id}` })
    .setTimestamp()

    if (length) {
        embed.addFields({ name: 'Length', value: `${length}`, inline: true })
    }

    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: guild });

    if (guildConfig && guildConfig.ModLogs) {
        const channel = client.channels.cache.get(guildConfig.ModLogs);
        if (!channel) return;
        channel.send({ embeds: [embed] })
    }
}
client.cache = new Map();
client.config = require('./config.json');
client.logs = require('./utils/Logs.js');

require('./utils/Loader.js')(client);
require('./utils/Register.js')(client);
require('./utils/ImportantHandler.js')(client);

client.logs.info(`Logging in...`);
client.login(client.config.TOKEN);
client.on('ready', async function () {
    client.logs.success(`Logged in as ${client.user.tag}!`);

    const mongodb = client.config.mongodb;

    if (!mongodb) return;

    mongoose.set("strictQuery", false);

    await mongoose.connect(mongodb || "", {
      //keepAlive: true,
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
    });

    if (mongoose.connect) {
      mongoose.set("strictQuery", true);
      client.logs.success("Database connection established!");
    }

    client.schemas = require('./utils/SchemaLoader.js')();
});


async function InteractionHandler(interaction, type) {

    let command, args, name;

    if (type === 'prefix') {
        args = interaction.content.slice(client.config.prefix.length).trim().split(/ +/);
        name = args.shift().toLowerCase();
    } else {
        args = interaction.customId?.split("_") ?? [];
        name = args.shift();
    }

    command = client[type].get( name ?? interaction.commandName );
    if (!command) {
        if (type === 'prefix') return;
        await interaction.reply({
            content: `There was an error while executing this command!\n\`\`\`Command not found\`\`\``,
            ephemeral: true
        }).catch( () => {} );
        client.logs.error(`${type} not found: ${interaction.customId}`);
        return;
    }

    try {
        if (type !== 'prefix' && interaction.isAutocomplete()) {
            await command.autocomplete(interaction, client, args);
        } else {
            await command.execute(interaction, client, args);
        }
    } catch (error) {
        client.logs.error(error.stack);
        client.logs.error(error);
        if (type === 'prefix') return;
        await interaction.deferReply({ ephemeral: true }).catch( () => {} );
        await interaction.editReply({
            content: `There was an error while executing this command!\n\`\`\`${error}\`\`\``,
            ephemeral: true
        }).catch( () => {} );
    }

}

client.on('interactionCreate', async function(interaction) {
    if (!interaction.isCommand() && !interaction.isAutocomplete()) return;
    
    const subcommand = interaction.options._subcommand ?? "";
    const subcommandGroup = interaction.options._subcommandGroup ?? "";
    const commandArgs = interaction.options._hoistedOptions ?? [];
    const args = `${subcommandGroup} ${subcommand} ${commandArgs.map(arg => arg.value).join(" ")}`.trim();
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > /${interaction.commandName} ${args}`);

    await InteractionHandler(interaction, 'commands');
});


client.on('interactionCreate', async function(interaction) {
    if (!interaction.isButton()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > [${interaction.customId}]`);
    await InteractionHandler(interaction, 'buttons');
});


client.on('interactionCreate', async function(interaction) {
    if (!interaction.isStringSelectMenu()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > <${interaction.customId}>`);
    await InteractionHandler(interaction, 'menus');
});


client.on('interactionCreate', async function(interaction) {
    if (!interaction.isModalSubmit()) return;
    client.logs.info(`${interaction.user.tag} (${interaction.user.id}) > {${interaction.customId}}`);
    await InteractionHandler(interaction, 'modals');
});

client.on('messageCreate', async function(message) {
    if (!message.guild || message.author.bot) return;
    let prefix = client.cache.get(`prefix_${message.guild.id}`);
    if (!prefix) {
        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: message.guild.id });
        if (guildConfig?.Prefix) {
            client.cache.set(`prefix_${message.guild.id}`, guildConfig.Prefix);
            prefix = client.cache.get(`prefix_${message.guild.id}`);
        }
    }
    if (!message.content.startsWith(prefix || client.config.prefix)) return;

    let args = message.content.slice(client.config.prefix.length).split(/ +/);
    let command = args.shift().toLowerCase();

    if (!client.prefix.get(command)) return;

    client.logs.info(`${message.author.tag} (${message.author.id}) > ${prefix}${command} ${args.join(" ")}`);
    await InteractionHandler(message, 'prefix');
});

//Logs
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
        return `${years} years, ${months} months, ${days} days`
    } else if (months > 0) {
        return `${months} months, ${weeks} weeks, ${days} days, ${hours} hr(s)`
    } else if (weeks > 0) {
        return `${weeks} weeks, ${days} days, ${hours} hr(s), ${minutes} min(s), ${seconds} sec(s)`
    } else if (days > 0) {
        return `${days} days, ${hours} hr(s), ${minutes} min(s), ${seconds} sec(s)`
    } else if (hours > 0) {
        return `${hours} hr(s), ${minutes} min(s), ${seconds} sec(s)`
    } else if (minutes > 0) {
        return `${minutes} min(s), ${seconds} sec(s)`
    } else {
        return `${seconds} sec(s)`
    }
}

client.on(Events.GuildMemberAdd, async function(member) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: member.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    let embed = new EmbedBuilder()
    .setAuthor({ name: `Member Joined`, iconURL: member.user.displayAvatarURL() })
    .setDescription(`${member} ${member.user.tag}`)
    .addFields(
        { name: `Account Age`, value: `${await formatUnix(member.user.createdAt / 1000)}` }
    )
    .setColor("#43b582")
    .setFooter({ text: `ID: ${member.id}` })
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberRemove, async function (member) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: member.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    let embed = new EmbedBuilder()
    .setAuthor({ name: `Member Left`, iconURL: member.user.displayAvatarURL() })
    .setDescription(`${member} ${member.user.tag}\n \u200b`)
    .setColor("#ff470f")
    .setFooter({ text: `ID: ${member.id}` })
    .setThumbnail(member.user.displayAvatarURL())
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.MessageUpdate, async function (oldMessage, newMessage) {
    if (oldMessage.content == newMessage.content) return;

    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newMessage.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#337fd5")
    .setAuthor({ name: `${newMessage.author.tag}`, iconURL: newMessage.author.displayAvatarURL() })
    .setDescription(`**Message Edited in ${newMessage.channel}** [Jump to Message](${newMessage.url})`)
    .addFields(
        { name: `Before`, value: `${oldMessage.content || '*No message content*'}` },
        { name: `after`, value: `${newMessage.content || '*No message content*'}` }
    )
    .setFooter({ text: `User ID: ${newMessage.author.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.MessageBulkDelete, async function (messages) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: messages.first().guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#337fd5")
    .setAuthor({ name: `${messages.first().guild.name}`, iconURL: messages.first().guild.iconURL() })
    .setTimestamp()
    .setDescription(`**Bulk Delete in ${messages.first().channel}, ${messages.size} messages deleted**`)

    channel.send({ embeds: [embed] });
})

client.on(Events.MessageDelete, async function (message) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: message.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#ff470f")
    .setTimestamp()
    .setFooter({ text: `Author: ${message.author.id} | Message ID: ${message.id}` })
    .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
    .setDescription(`**Message sent by ${message.author} Deleted in ${message.channel}**\n${message.content || '*No message content*'}`)
    .setImage(message?.attachments?.first()?.url)

    channel.send({ embeds: [embed] });
});

client.on(Events.VoiceStateUpdate, async function (oldState, newState) {

    let embed, guildConfig;

    if (!oldState.channel && newState) {
        embed = new EmbedBuilder()
        .setColor("#43b582")
        .setAuthor({ name: `${newState.member.user.tag}`, iconURL: newState.member.displayAvatarURL() })
        .setDescription(`**${newState.member} joined voice channel ${newState.channel}**`)
        .setFooter({ text: `ID: ${newState.member.id}` })
        .setTimestamp()

        guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newState.guild.id });
    }

    if (oldState && !newState.channel) {
        embed = new EmbedBuilder()
        .setColor("#ff470f")
        .setAuthor({ name: `${oldState.member.user.tag}`, iconURL: oldState.member.displayAvatarURL() })
        .setDescription(`**${oldState.member} left voice channel ${oldState.channel}**`)
        .setFooter({ text: `ID: ${oldState.member.id}` })
        .setTimestamp()

        guildConfig = await client.schemas.GuildConfig.findOne({ Guild: oldState.guild.id });
    }

    if (oldState.channel && newState.channel) {
        embed = new EmbedBuilder()
        .setColor("#43b582")
        .setAuthor({ name: `${oldState.member.user.tag}`, iconURL: oldState.member.displayAvatarURL() })
        .setDescription(`**${newState.member} switched voice channels ${oldState.channel} -> ${newState.channel}**`)
        .setFooter({ text: `ID: ${oldState.member.id}` })
        .setTimestamp()

        guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newState.guild.id });
    }

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    channel.send({ embeds: [embed] })
});

client.on(Events.ChannelCreate, async function(newChannel) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newChannel.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setDescription(`**Channel Created: #${newChannel.name}**`)
    .setAuthor({ name: `${newChannel.guild.name}`, iconURL: newChannel.guild.iconURL() })
    .setFooter({ text: `ID: ${newChannel.id}` })
    .setTimestamp()
    .setColor("#43b582")

    channel.send({ embeds: [embed] })
});

client.on(Events.ChannelUpdate, async function (oldChannel, newChannel) {
    if (oldChannel.name == newChannel.name) return;
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newChannel.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#43b582")
    .setTitle('Channel Updated')
    .setDescription(`${newChannel} was changed:\n\nName changed: **#${oldChannel.name}** -> **#${newChannel.name}**`)
    .setTimestamp()
    .setFooter({ text: `ID: ${newChannel.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] })
})

client.on(Events.ChannelDelete, async function(oldChannel) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: oldChannel.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setDescription(`**Channel Deleted: #${oldChannel.name}**`)
    .setAuthor({ name: `${oldChannel.guild.name}`, iconURL: oldChannel.guild.iconURL() })
    .setFooter({ text: `ID: ${oldChannel.id}` })
    .setTimestamp()
    .setColor("#ff470f")

    channel.send({ embeds: [embed] })
});

client.on(Events.GuildMemberUpdate, async function (oldMember, newMember) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newMember.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const removedRoles = client.cache.get(`removedRoles_${newMember.user.id}_${newMember.guild.id}`) || [];
    const addedRoles = client.cache.get(`addedRoles_${newMember.user.id}_${newMember.guild.id}`) || [];

    let embed;

    oldMember.roles.cache.forEach(role => {
        if (role.id === oldMember.guild.id) {
            return;
        }
        if (!newMember.roles.cache.has(role.id)) {
            removedRoles.push(`\`${role.name}\``);
        }
    });
    
    newMember.roles.cache.forEach(role => {
        if (role.id === newMember.guild.id) {
            return;
        }
        if (!oldMember.roles.cache.has(role.id)) {
            addedRoles.push(`\`${role.name}\``);
        }
    });

    client.cache.set(`removedRoles_${newMember.user.id}_${newMember.guild.id}`, removedRoles);
    client.cache.set(`addedRoles_${newMember.user.id}_${newMember.guild.id}`, addedRoles);

    await new Promise(resolve => setTimeout(resolve, 1000 * 3));

    const remRoles = client.cache.get(`removedRoles_${newMember.user.id}_${newMember.guild.id}`);
    const addRoles = client.cache.get(`addedRoles_${newMember.user.id}_${newMember.guild.id}`);

    if (addRoles?.length > 0 && remRoles?.length > 0) return;

    if (addRoles?.length > 0) {
        if (addRoles?.length === 1) {
            embed = new EmbedBuilder()
            .setColor("#337fd5")
            .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL() })
            .setDescription(`**${newMember} was given the ${addedRoles[0]} role**`)
            .setFooter({ text: `ID: ${newMember.id}` })
            .setTimestamp()
        } else {
            embed = new EmbedBuilder()
            .setColor("#337fd5")
            .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL() })
            .setDescription(`**${newMember} was given the roles ${addedRoles.join(', ')}**`)
            .setFooter({ text: `ID: ${newMember.id}` })
            .setTimestamp()
        }
    }

    if (remRoles?.length > 0) {
        if (remRoles?.length === 1) {
            embed = new EmbedBuilder()
            .setColor("#337fd5")
            .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL() })
            .setDescription(`**${newMember} was removed from the ${removedRoles[0]} role**`)
            .setFooter({ text: `ID: ${newMember.id}` })
            .setTimestamp()
        } else {
            embed = new EmbedBuilder()
            .setColor("#337fd5")
            .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL() })
            .setDescription(`**${newMember} was removed from the roles ${removedRoles.join(', ')}**`)
            .setFooter({ text: `ID: ${newMember.id}` })
            .setTimestamp()
        }
    }

    client.cache.delete(`removedRoles_${newMember.user.id}_${newMember.guild.id}`);
    client.cache.delete(`addedRoles_${newMember.user.id}_${newMember.guild.id}`);
    channel.send({ embeds: [embed] }).catch(() => {})
});

client.on(Events.GuildBanAdd, async function (ban) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: ban.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#ff470f")
    .setAuthor({ name: 'Member Banned', iconURL: ban.user.displayAvatarURL() })
    .setDescription(`${ban.user} ${ban.user.tag}\n \u200b`)
    .setFooter({ text: `ID: ${ban.user.id}` })
    .setTimestamp()
    .setThumbnail(ban.user.displayAvatarURL())

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildBanRemove, async function (ban) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: ban.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#337fd5")
    .setAuthor({ name: 'Member Unbanned', iconURL: ban.user.displayAvatarURL() })
    .setDescription(`${ban.user} ${ban.user.tag}\n \u200b`)
    .setFooter({ text: `ID: ${ban.user.id}` })
    .setTimestamp()
    .setThumbnail(ban.user.displayAvatarURL())

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildMemberUpdate, async function (oldMember, newMember) {
    if (oldMember.nickname === newMember.nickname) return;
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newMember.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#337fd5")
    .setAuthor({ name: `${newMember.user.tag}`, iconURL: newMember.user.displayAvatarURL() })
    .setDescription(`${newMember.user} **nickname changed**`)
    .addFields(
        { name: `Before`, value: `${oldMember.nickname || 'None'}` },
        { name: `after`, value: `${newMember.nickname || 'None'}` }
    )
    .setFooter({ text: `ID: ${newMember.user.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildRoleCreate, async function (role) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: role.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#43b582")
    .setAuthor({ name: `${role.guild.name}`, iconURL: role.guild.iconURL() })
    .setDescription(`**Role Created: ${role.name}**`)
    .setFooter({ text: `ID: ${role.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildRoleDelete, async function (role) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: role.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#ff470f")
    .setAuthor({ name: `${role.guild.name}`, iconURL: role.guild.iconURL() })
    .setDescription(`**Role Deleted: ${role.name}**`)
    .setFooter({ text: `ID: ${role.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildRoleUpdate, async function (oldRole, newRole) {
    if (oldRole?.color === newRole?.color) return;

    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newRole.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    
    if (newRole.color === 0) {
        newRole.color = "000000"
    }

    if (oldRole.color === 0) {
        oldRole.color = "000000"
    }

    const embed = new EmbedBuilder()
    .setColor(`#${newRole.color.toString(16)}`)
    .setAuthor({ name: `${newRole.guild.name}`, iconURL: newRole.guild.iconURL() })
    .setDescription(`**Role Color Changed: #${oldRole.color.toString(16)} > #${newRole.color.toString(16)}**`)
    .setFooter({ text: `ID: ${newRole.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildEmojiCreate, async function (emoji) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: emoji.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#43b582")
    .setDescription(`New emoji has been made: \`:${emoji.name}:\``)
    .setTitle('Emoji Created')
    .setThumbnail(emoji.imageURL())
    .setFooter({ text: `ID: ${emoji.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildEmojiDelete, async function (emoji) {
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: emoji.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#f04a47")
    .setDescription(`The \`:${emoji.name}:\` emoji has been deleted!`)
    .setTitle('Emoji Deleted')
    .setThumbnail(emoji.imageURL())
    .setFooter({ text: `ID: ${emoji.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});

client.on(Events.GuildEmojiUpdate, async function (oldEmoji, newEmoji) {
    if (oldEmoji.name === newEmoji.name) return;
    const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: newEmoji.guild.id });

    if (!guildConfig || !guildConfig.Logs) return;

    const channel = client.channels.cache.get(guildConfig.Logs);

    if (!channel) return;

    const embed = new EmbedBuilder()
    .setColor("#337fd5")
    .setDescription(`\`:${oldEmoji.name}:\` was changed to \`:${newEmoji.name}:\``)
    .setTitle('Emoji Updated')
    .setThumbnail(newEmoji.imageURL())
    .setFooter({ text: `ID: ${newEmoji.id}` })
    .setTimestamp()

    channel.send({ embeds: [embed] });
});
//Logs
