const fs = require('node:fs');

module.exports = function () {
	const schemas = fs.readdirSync('./Schemas').filter(file => file.endsWith('.js'));

	const schemaExports = {};

	for (const file of schemas) {
		const fileName = file.split('.')[0];
		schemaExports[fileName] = require(`../Schemas/${file}`);
	}

	return schemaExports;
}