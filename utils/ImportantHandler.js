const { ActivityType } = require('discord.js')

module.exports = (client) => {
    client.on('ready', (c) => {
        setInterval(() => {

            let status = [
              {
                name: `Credits to arnsfh#1492`,
                type: ActivityType.Playing,
              },
              {
                name: 'customstatus',
                state: `https://github.com/loxt-nixo/dyno-remake`,
                type: ActivityType.Custom,
              },
              {
                type: ActivityType.Playing,
                name: `${c.user.username} | ?help`,
              },
            ];
            let random = Math.floor(Math.random() * status.length);
            client.user.setActivity(status[random]);

          }, `5000`);
    })
}