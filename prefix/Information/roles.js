module.exports = {
    name: 'roles',
    description: 'Get a list of server roles.',
    aliases: [],
    execute: async function (msg, client) {
        const roles = msg.guild.roles.cache.map(r => {
            if (r.id === msg.guild.id) {
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
                    title = `Roles [${msg.guild.roles.cache.size}]`
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

            msg.channel.send({ embeds: embeds });
        } else {
            const embed = {
                title: `Roles [${msg.guild.roles.cache.size}]`,
                description: `${roles}\n@everyone`,
                color: 0x337fd5,
            }
    
            msg.channel.send({ embeds: [embed] });
        }
    }
}