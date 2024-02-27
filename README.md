# Dyno Remake

**Note: If you use this bot, please remember to give proper credits to arnsfh and manta_maahil**

## Bot Configurations:

Before you start using the Dyno Remake bot, follow these steps to set up your configuration file (Config.json):

1. **TOKEN:**

   - Create a new bot on the [Discord Developer Portal](https://discord.com/developers/applications) and obtain your Bot Token.

2. **APP_ID and APP_SECRET:**

   - Create a new application on the [Discord Developer Portal](https://discord.com/developers/applications), and get your Client ID and Client Secret.

3. **prefix:**

   - Choose your preferred command prefix for the bot. Example: `"?"`

4. **mongodb:**

   - Set up a MongoDB database and provide the connection URL.

5. **developers:**
   - Add Discord IDs of developers who should have special access.

Example Config.json:

```json
{
  "TOKEN": "YOUR_BOT_TOKEN",
  "APP_ID": "YOUR_CLIENT_ID",
  "APP_SECRET": "YOUR_CLIENT_SECRET",
  "prefix": "?",
  "mongodb": "YOUR_MONGODB_URL",
  "embedSuccess": "#43b582",
  "embedError": "#f04a47",
  "developers": ["DeveloperID1", "DeveloperID2"]
}
```
