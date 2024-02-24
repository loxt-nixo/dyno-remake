const fs = require('node:fs');

const modules = [
	'commands',
	'buttons',
	'menus',
	'modals',
	'prefix'
];

module.exports = (client) => {
	for (const module of modules) {
		client.logs.debug(`Loading ${module}...`)
		client[module] = new Map();

		if (!fs.existsSync(`./${module}`)) {
			client.logs.warn(`No ${module} folder found - Skipping...`);
			continue;
		}

		load(client[module], module.toUpperCase(), module);
		client.logs.success(`Loaded ${client[module].size} ${module}`)
	}
};

function load(map, type, path = '', depth = 3) {
	const commands = fs.readdirSync(`./${path}`, { withFileTypes: true });

	for (const file of commands) {
		if (file.isDirectory()) {
			if (depth === 0) return console.log(`\x1b[31m[COMMANDS] Maximum depth reached - Skipping ${file.name}\x1b[0m`);
			load(map, type, `${path}/${file.name}`, depth - 1);
			continue;
		}

		if (!file.name.endsWith('.js')) continue;

		try {
			const command = require(`../${path}/${file.name}`);
			if (!command) throw `No command found`;
			if (!command.execute) throw `No execute function found`;
			if (typeof command.execute !== 'function') throw `Execute is not a function`;
			if (type === 'COMMANDS') {
				if (!command.data) throw `No data property found`;
				addComponent(map, command.data.name, command);
			} else if (type === 'PREFIX') {
				if (command.aliases?.length > 0) {
					command.aliases.push(command.name);
					command.name = command.aliases;
				}
				addComponent(map, command.name, command);
			} else {
				if (!command.customID) throw `No custom ID has been set`;

				if (!Array.isArray(command.customID) && typeof command.customID !== 'string') throw `Invalid custom ID type - Must be string (single) or array (multiple)`;

				addComponent(map, command.customID, command);
			}
		} catch (error) {
			console.log(`\x1b[31m[${type}] Failed to load ./${path}/${file.name}: ${error.stack || error}\x1b[0m`);
		}

	}
}


function addComponent(map, id, data) {
	const duplicateIDs = [];
	if (Array.isArray(id)) {
		for (const i of id) {
			if (map.has(i)) duplicateIDs.push(i);
			map.set(i, Object.assign(data, { customID: i }));
		}
	}

	if (typeof id === 'string') {
		if (map.has(id)) duplicateIDs.push(id);
		map.set(id, Object.assign(data, { customID: id }));
	}

	if (duplicateIDs.length > 0) throw `Duplicate IDs found: ${duplicateIDs.join(', ')}`;
}