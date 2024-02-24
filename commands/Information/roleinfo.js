const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Get information about a role.')
    .addRoleOption(option => option
        .setName('role')
        .setDescription('Role to get info for')
        .setRequired(true)),
    execute: async function (interaction) {
        const role = interaction.options.getRole('role');

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

        const color = role.color ? ('00000' + role.color.toString(16)).slice(-6) : null;

        const embed = {
			fields: [
				{ name: 'ID', value: role.id, inline: true },
				{ name: 'Name', value: role.name, inline: true },
				{ name: 'Color', value: color ? `#${color}` : 'None', inline: true },
				{ name: 'Mention', value: `\`<@&${role.id}>\``, inline: true },
				{ name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
				{ name: 'Position', value: role.position.toString(), inline: true },
				{ name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
			],
			footer: {
				text: `Role Created`,
			},
			timestamp: new Date(role.createdAt),
		};

        if (color) {
            embed.color = role.color;
        }

        if (role.permissions) {
            let infoPerms = []
			if (role.permissions.has(PermissionFlagsBits.Administrator)) infoPerms.push(perms['administrator']);
            if (role.permissions.has(PermissionFlagsBits.ManageGuild)) infoPerms.push(perms['manageGuild'])
            if (role.permissions.has(PermissionFlagsBits.ManageRoles)) infoPerms.push(perms['manageRoles'])
            if (role.permissions.has(PermissionFlagsBits.ManageChannels)) infoPerms.push(perms['manageChannels'])
            if (role.permissions.has(PermissionFlagsBits.ManageMessages)) infoPerms.push(perms['manageMessages'])
            if (role.permissions.has(PermissionFlagsBits.ManageWebhooks)) infoPerms.push(perms['manageWebhooks'])
            if (role.permissions.has(PermissionFlagsBits.ManageNicknames)) infoPerms.push(perms['manageNicknames'])
            if (role.permissions.has(PermissionFlagsBits.KickMembers)) infoPerms.push(perms['kickMembers'])
            if (role.permissions.has(PermissionFlagsBits.BanMembers)) infoPerms.push(perms['banMembers'])
            if (role.permissions.has(PermissionFlagsBits.MentionEveryone)) infoPerms.push(perms['mentionEveryone'])
            if (role.permissions.has(PermissionFlagsBits.ModerateMembers)) infoPerms.push(perms['timeoutMembers'])

			if (infoPerms.length) {
				embed.fields.push({ name: 'Key Permissions', value: infoPerms.join(', '), inline: false });
			}
		}

        interaction.reply({ embeds: [embed] });
    }
}