const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Get a list of server roles.'),
    execute: async function (interaction) {
        const roles = interaction.guild.roles.cache.map(r => {
            if (r.id === interaction.guild.id) {
                return '';
            }
            return `<@&${r.id}>`;
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
                    title = `Roles [${interaction.guild.roles.cache.size}]`
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

            interaction.reply({ embeds: embeds });
        } else {
            const embed = {
                title: `Roles [${interaction.guild.roles.cache.size}]`,
                description: `${roles}\n@everyone`,
                color: 0x337fd5,
            }
    
            interaction.reply({ embeds: [embed] });
        }
    }
}