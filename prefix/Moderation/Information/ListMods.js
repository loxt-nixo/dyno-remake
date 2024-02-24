module.exports = {
    name: 'listmods',
    description: 'list Moderators.',
    aliases: [],
    execute: async function(msg, client) {
        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: msg.guild.id });

        const modCheck = await client.checkMod(msg.member._roles, msg.guild.id);

        if (!modCheck && !msg.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return;

        let embed;

        if (!guildConfig) {
            embed = {
                color: 0x337fd5,
                description: `<:info:1205595965004972042> There are no moderator roles. Add one using \`/addmod role\``
            }

            return msg.channel.send({ embeds: [embed], ephemeral: true });
        }

        if (guildConfig.ModRoles.length == 0) {
            embed = {
                color: 0x337fd5,
                description: `<:info:1205595965004972042> There are no moderator roles. Add one using \`/addmod role\``
            }

            return msg.channel.send({ embeds: [embed], ephemeral: true });
        }

        embed = {
            description: `${guildConfig.ModRoles.map(role => { return `<@&${role}>`} ).join('\n')}`,
            color: 0x337fd5,
            title: `Moderator Roles`
        }

        msg.channel.send({ embeds: [embed] })
    }
}