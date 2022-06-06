// built-in node modules
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// modules from dev dependencies
const { camelCase, upperFirst } = require('lodash');
const cheerio = require('cheerio');
const sharp = require('sharp');
const potrace = require('potrace');

// turns kebab-case names into PascalCase
const pascal = string => upperFirst(camelCase(string));

// converts a directory for kebab-case .svg files
// into webpack output config of PascalCase vue components
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

// gets svg dimensions by reading width & height attrs
function getSvgDimensions(svgString) {
	const $ = cheerio.load(svgString, { xmlMode: true });
	const $svg = $('svg');
	return {
		width: Number.parseInt($svg.attr('width'), 10),
		height: Number.parseInt($svg.attr('height'), 10),
	};
}

const trace = promisify(potrace.trace);

// removes unnecessary attrs
function cleanTracedSvg(svgString) {
	const $ = cheerio.load(svgString, { xmlMode: true });

	const $path = $('path');
	$path.removeAttr('fill');
	$path.removeAttr('stroke');
	$path.attr('d', $path.attr('d').trim());

	return $.xml();
};

// convert strokes to fills
async function traceSvg(svgString) {
	let cleanedTracedSvgString;
	try {
		const svgBuffer = await sharp(Buffer.from(svgString), { density: 2400 }).toBuffer();
		const svgDimensions = getSvgDimensions(svgString);
		const tracedSvgString = await trace(svgBuffer, svgDimensions);
		cleanedTracedSvgString = cleanTracedSvg(tracedSvgString);
	} catch (error) {
		const tracingError = new Error('Error tracing SVG');
		Object.assign(tracingError, { svgString, e: error });
		throw tracingError;
	}
	return cleanedTracedSvgString;
}

function ensureDirectory(directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory);
	}
}

module.exports = {
	getIconEntries,
	traceSvg,
	pascal,
	ensureDirectory,
};
