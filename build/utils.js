const fs = require('fs');
const path = require('path');
const { camelCase, upperFirst } = require('lodash');
const pascal = string => upperFirst(camelCase(string));

function getIconEntries(dir) {
	const iconPaths = fs.readdirSync(dir)
		.filter(f => f.endsWith('.svg'));

	const entries = {};
	iconPaths.forEach(file => {
		const isRelative = dir.startsWith('./');
		let svgPath = path.join(dir, file);
		if (isRelative) {
			svgPath = `./${svgPath}`;
		}
		entries[pascal(path.basename(file, '.svg'))] = svgPath;
	});

	return entries;
}

module.exports = {
	getIconEntries,
};
