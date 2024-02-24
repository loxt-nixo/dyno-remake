module.exports = {
    name: 'addmod',
    description: 'Add a moderator role',
    aliases: [],
    execute: async function(msg, client, args) {
        const role = msg.guild.roles.cache.get(args[0]) || msg.mentions.roles.first();

        if (!msg.member.permissions.has('Administrator')) return;

        let embed;

        if (!role) {
            embed = {
                description: `Usage:\n?addmod role\n?addmod @mod\n?addmod roleid`,
                color: client.hexToInt(client.config.embedError),
                title: `Command: addmod`
            }

            return msg.channel.send({ embeds: [embed] })
        }

        const guildConfig = await client.schemas.GuildConfig.findOne({ Guild: msg.guild.id });

        if (guildConfig && guildConfig.ModRoles.includes(role.id)) {

            embed = {
                description: `<:error:1205124558638813194> That role already has moderator permissions`,
                color: client.hexToInt(client.config.embedError)
            }
            
            return msg.channel.send({ embeds: [embed], ephemeral: true })
        } else if (guildConfig && !guildConfig.ModRoles.includes(role.id)) {
            guildConfig.ModRoles.push(role.id);

            await guildConfig.save();

            embed = {
                description: `<:success:1205124560622456832> Users in role \`${role.name}\` now have moderator permissions`,
                color: client.hexToInt(client.config.embedSuccess)
            }

            return msg.channel.send({ embeds: [embed] })
        } else {
            await client.schemas.GuildConfig.create({ Guild: msg.guild.id, ModRoles: [`${role.id}`] });

            embed = {
                description: `<:success:1205124560622456832> Users in role \`${role.name}\` now have moderator permissions`,
                color: client.hexToInt(client.config.embedSuccess)
            }

            return msg.channel.send({ embeds: [embed] })
        }
    }
}