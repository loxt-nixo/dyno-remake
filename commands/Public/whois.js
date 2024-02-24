const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('Get user information')
        .addUserOption(o => o
            .setName('member')
            .setDescription('User to get information for')
            .setRequired(false)),
    execute: async function(interaction, client) {
        let member = interaction.options.getMember('member') || interaction.member

		if (!member) return interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> I couldn't find the user ${member}`)], ephemeral: true });

		const perms = {
			administrator: 'Administrator',
			manageGuild: 'Manage Server',
			manageRoles: 'Manage Roles',
			manageChannels: 'Manage Channels',
			manageMessages: 'Manage Messages',
			manageWebhooks: 'Manage Webhooks',
			manageNicknames: 'Manage Nicknames',
			manageEmojis: 'Manage Emojis',
			kickMembers: 'Kick Members',
			banMembers: 'Ban Members',
			mentionEveryone: 'Mention Everyone',
            timeoutMembers: 'Timeout Members',
		};

		const extra = [];
		let team = [];

		const roles = member.roles.cache.map(r => {
                if (r.id === interaction.guild.id) {
                    return '';
                }

				return `<@&${r.id}>`;
			}).join('  ') || 'None';

		const embed = {
            color: 0x337fd5,
			author: {
				name: member.user.tag,
				icon_url: member.user.displayAvatarURL(),
			},
            thumbnail: {
                url: member.user.displayAvatarURL()
            },
			description: `\n<@!${member.id}>`,
			fields: [
				// { name: 'Status', value: member.status, inline: true },
				{ name: 'Joined', value: moment.unix(member.joinedAt / 1000).format('llll'), inline: true },
				{ name: 'Registered', value: moment.unix(member.user.createdAt / 1000).format('llll'), inline: true },
				{ name: `Roles [${member.roles.cache.size - 1}]`, value: roles.length > 1024 ? `Too many roles to show.` : roles, inline: false },
			],
			footer: { text: `ID: ${member.id}` },
			timestamp: new Date(),
		};

		if (member.permissions) {
            let infoPerms = []
			if (member.permissions.has(PermissionFlagsBits.Administrator)) infoPerms.push(perms['administrator']);
            if (member.permissions.has(PermissionFlagsBits.ManageGuild)) infoPerms.push(perms['manageGuild'])
            if (member.permissions.has(PermissionFlagsBits.ManageRoles)) infoPerms.push(perms['manageRoles'])
            if (member.permissions.has(PermissionFlagsBits.ManageChannels)) infoPerms.push(perms['manageChannels'])
            if (member.permissions.has(PermissionFlagsBits.ManageMessages)) infoPerms.push(perms['manageMessages'])
            if (member.permissions.has(PermissionFlagsBits.ManageWebhooks)) infoPerms.push(perms['manageWebhooks'])
            if (member.permissions.has(PermissionFlagsBits.ManageNicknames)) infoPerms.push(perms['manageNicknames'])
            if (member.permissions.has(PermissionFlagsBits.KickMembers)) infoPerms.push(perms['kickMembers'])
            if (member.permissions.has(PermissionFlagsBits.BanMembers)) infoPerms.push(perms['banMembers'])
            if (member.permissions.has(PermissionFlagsBits.MentionEveryone)) infoPerms.push(perms['mentionEveryone'])
            if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) infoPerms.push(perms['timeoutMembers'])

			if (infoPerms.length) {
				embed.fields.push({ name: 'Key Permissions', value: infoPerms.join(', '), inline: false });
			}
		}

		if (member.id === client.user.id) {
			team.push('A Real Dyno');
		}
		// if (this.isAdmin(member)) extra.push(`Dyno Creator`);
		
			if (member.id === interaction.guild.ownerId) {
				extra.push(`Server Owner`);
			} else if (member.permissions.has(PermissionFlagsBits.Administrator)) {
				extra.push(`Server Admin`);
			} else if (member.permissions.has(PermissionFlagsBits.ManageGuild)) {
				extra.push(`Server Manager`);
			} else if (member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
			    extra.push(`Server Moderator`);
            }

		if (extra.length) {
			embed.fields.push({ name: 'Acknowledgements', value: extra.join(', '), inline: false });
		}

		if (team.length) {
			embed.fields.push({ name: 'Dyno Team', value: `${team.join(', ')}`, inline: false });
		}

		interaction.reply({ embeds: [embed] })
    }
}
