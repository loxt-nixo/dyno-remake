module.exports = {
    name: 'ping',
    description: 'Ping the bot',
    aliases: [],
    execute: async function (msg, client, args) {
        msg.channel.send({ content: 'Pong! `' + client.ws.ping + 'ms`' });
    }
}