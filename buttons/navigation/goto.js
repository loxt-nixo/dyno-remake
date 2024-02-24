module.exports = {
	customID: 'goto',
	execute: async function(interaction, client, args) {
		const type = args.shift();
		const name = args.shift();

		await interaction.deferUpdate();

		if (type === 'commands') {
			Object.assign(interaction, {
				options: {
					type: args.join('_')
				}
			});
		}
	
		const command = client[type].get(name);
		return await command.execute(interaction, client, args);
	}
}