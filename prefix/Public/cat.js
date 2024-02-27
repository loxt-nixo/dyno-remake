const axios = require("axios");

module.exports = {
  name: "cat",
  description: "Get a random image of a cute cat",
  aliases: [],
  execute: async function (msg, client, args) {
    try {
      await msg.reply("Looking for kitty...");

      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      const imageUrl = response.data[0].url;

      const embed = {
        title: "🐱 Meow",
        color: 0x7289da, // "burple" color
        image: { url: imageUrl },
      };

      await msg.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      msg.editReply(
        "Sorry, something went wrong while fetching a cute cat image."
      );
    }
  },
};
