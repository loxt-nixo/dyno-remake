const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Get server info/stats.'),
    async execute (interaction, client) {
        const { guild } = interaction;
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

        interaction.reply({ embeds: [embed], components: [row] });
    }
}