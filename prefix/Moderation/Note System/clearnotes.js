module.exports = {
    name: 'clearnotes',
    description: 'Delete all notes for a member',
    aliases: [],
    execute: async function (msg, client, args) {

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        const user = msg.guild.members.cache.get(args[0]) || msg.mentions.members.first();

        if (!user) {
            let embed = {
                description: `Usage:\n?clearnotes user\n?clearnotes @user\n?clearnotes userid`,
                title: `Command: notes`,
                color: client.hexToInt(client.config.embedError)
            }

            return msg.channel.send({ embeds: [embed] })
        }

        await client.schemas.noteSchema.deleteMany({ Guild: msg.guild.id, User: user.id })

        let embed = {
            description: `<:success:1205124560622456832> Cleared all notes for ${user.user.tag}`,
            color: client.hexToInt(client.config.embedSuccess)
        }

        msg.channel.send({ embeds: [embed] })
    }
}