const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'serverinfo',
    description: 'Get server info/stats.',
    execute: async function (msg, client, args) {
        const guild = (client.config.developers.includes(msg.author.id) && args && args.length) ? client.guilds.cache.get(args[0]) : msg.channel.guild;

		const owner = client.users.cache.get(guild.ownerId);

		let categories = guild.channels.cache.filter(c => c.type === 4).length;
		let textChannels = guild.channels.cache.filter(c => c.type === 0).length;
		let voiceChannels = guild.channels.cache.filter(c => c.type === 2).length;

		const embed = {
			color: 0x337fd5,
			author: {
				name: guild.name,
				icon_url: guild.iconURL(),
			},
			thumbnail: {
				url: guild.iconURL(),
			},
			fields: [
				{ name: 'Owner', value: owner.tag, inline: true },
                { name: 'Members', value: guild.memberCount.toString(), inline: true },
                { name: 'Roles', value: guild.roles.cache.size.toString(), inline: true },
				{ name: 'Category Channels', value: categories ? categories.toString() : '0', inline: true },
				{ name: 'Text Channels', value: textChannels ? textChannels.toString() : '0', inline: true },
				{ name: 'Voice Channels', value: voiceChannels ? voiceChannels.toString() : '0', inline: true },
				// { name: 'Emojis', value: guild.emojis.length.toString(), inline: true },
			],
			footer: {
				text: `ID: ${guild.id} | Server Created`,
			},
			timestamp: new Date(guild.createdAt),
		};

		if (guild.roles.cache.size < 25) {
            const roles = msg.guild.roles.cache.map(r => {
                if (r.id === msg.guild.id) {
                    return '';
                }
                return `${r.name}`;
            }).join(', ') || 'None';
			embed.fields.push({ name: 'Role List', value: `${roles?.slice(2)}, @everyone`, inline: false });
		} else {
            var row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`roles_${guild.id}`)
                .setLabel('View Roles')
                .setStyle(ButtonStyle.Primary)
            )
        }

        msg.channel.send({ embeds: [embed], components: [row] });
    }
}