const { EmbedBuilder } = require('discord.js');

module.exports = {
    customID: 'roles',
    execute: async function (interaction, client, args) {
        const guild = client.guilds.cache.get(args[0]);

        if (!guild) {
            interaction.reply({ embeds: [new EmbedBuilder().setColor(client.config.embedError).setDescription(`<:error:1205124558638813194> I couldn't find the guild ${args[0] || ''}`)], ephemeral: true });
            return;
        }

        const roles = guild.roles.cache.map(r => {
            if (r.id === guild.id) {
                return '';
            }
            if (guild.id === interaction.guild.id) {
                return `<@&${r.id}>`;
            }
            return `${r.name}`;
        }).join('\n') || 'None';
        
        if (roles.length > 4096) {
            const chunkSize = 4096;
            const chunks = [];
            for (let i = 0; i < roles.length; i += chunkSize) {
                chunks.push(roles.substring(i, i + chunkSize));
            }
        
            const embeds = chunks.map((chunk, index) => {
                let description = chunk;
                if (index === 0) {
                    title = `Roles [${guild.roles.cache.size}]`
                    description = `${chunk}`;
                } else if (index === chunks.length - 1) {
                    description = `${chunk}\n@everyone`;
                    title = null;
                }
                return {
                    title: title,
                    description: description,
                    color: 0x337fd5,
                };
            });

            interaction.reply({ embeds: embeds, ephemeral: true });
        } else {
            const embed = {
                title: `Roles [${guild.roles.cache.size}]`,
                description: `${roles}\n@everyone`,
                color: 0x337fd5,
            }
    
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    }
}