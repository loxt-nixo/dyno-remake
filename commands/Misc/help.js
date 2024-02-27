const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Shows help info and commands"),
  execute: async function (interaction, client) {
    let embed = {
      title: `Server: ${interaction.guild.name}`,
      color: 0x337fd5,
      description: `Commands in this server start with \`${
        client.cache.get(`prefix_${interaction.guild.id}`) ||
        client.config.prefix
      }\`\n**Support and invites**\n[Invite ${
        client.user.username
      }](https://discord.com/api/oauth2/authorize?client_id=${
        client.user.id
      }permissions=28582941293814&scope=bot%20applications.commands)\n[Support Server](https://discord.gg/)`,
    };

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}permissions=28582941293814&scope=bot%20applications.commands`
        )
        .setLabel(`Invite ${client.user.username}`)
    );

    interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  },
};
