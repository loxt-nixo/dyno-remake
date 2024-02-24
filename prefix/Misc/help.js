const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Shows help info and commands',
    aliases: [],
    execute: async function (msg, client, args) {
        let embed = {
            title: `Server: ${msg.guild.name}`,
            color: 0x337fd5,
            description: `Commands in this server start with \`${client.cache.get(`prefix_${msg.guild.id}`) || client.config.prefix}\`\n**Support and invites**\n[Invite ${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}permissions=28582941293814&scope=bot%20applications.commands)\n[Support Server](https://discord.gg/)`
        }

        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}permissions=28582941293814&scope=bot%20applications.commands`)
            .setLabel(`Invite ${client.user.username}`)
        )

        msg.author.send({ embeds: [embed], components: [row] })
    }
}