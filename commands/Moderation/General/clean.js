const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissonsBitFeild,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clean")
    .setDescription("Deletes messages from the bot.")
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("The number of messages to delete (1-100).")
        .setRequired(false)
    ),
  async execute(interaction) {
    const count = interaction.options.getInteger("count") || 100;

    if (
      !interaction.member.permissions.has(
        PermissonsBitFeild.Flag.ManageMessages
      )
    ) {
      return interaction.reply({
        content: "❌ You don't have permission to use this command.",
        ephemeral: true,
      });
    }

    if (count < 1 || count > 100) {
      return interaction.reply({
        content: "❌ Please provide a count between 1 and 100.",
        ephemeral: true,
      });
    }

    try {
      const messages = await interaction.channel.messages.fetch({
        limit: count,
      });
      const botMessages = messages.filter((message) => message.author.bot);

      if (botMessages.size === 0) {
        const embed = new EmbedBuilder()
          .setColor("RED")
          .setDescription("❌ I couldn't find any messages to clean.");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      await interaction.channel.bulkDelete(botMessages);
      interaction.reply({
        content: `✅ Deleted ${botMessages.size} messages.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "❌ An error occurred while deleting messages.",
        ephemeral: true,
      });
    }
  },
};
