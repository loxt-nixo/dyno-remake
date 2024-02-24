module.exports = {
    name: 'setnick',
    description: 'Change the nickname of a user',
    aliases: [],
    execute: async function (msg, client, args) {
        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();
        const nick = args.slice(1).join(' ');

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const invalidArgs = {
            title: 'Command: setnick',
            description: `Usage:\n?setnick user new nickname\n?setnick @user bad nickname`,
            color: client.hexToInt(client.config.embedError)
        }

        if (!user || !nick) return msg.channel.send({ embeds: [invalidArgs] });

        const cantChange = {
            color: client.hexToInt(client.config.embedError),
            description: `<:error:1205124558638813194> Unable to change nickname for ${user.user.tag}.`
        }

        if (!user.manageable) return msg.channel.send({ embeds: [cantChange] });

        user.setNickname(nick);

        const nickSet = {
            color: client.hexToInt(client.config.embedSuccess),
            description: `<:success:1205124560622456832> Nickname set.`
        }

        msg.channel.send({ embeds: [nickSet] });
    }
}