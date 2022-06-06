const path = require('path');
const babel = require('@babel/core');
const  { pascal } = require('./utils');

class EntryFile {
	apply(compiler) {
		compiler.hooks.emit.tapAsync('webpack-distsize-plugin', (compilation, cb) => {
			const iconExports = Array.from(compilation.entrypoints.keys())
				.map(p => {
					const basename = path.basename(p);
					const exportAs = pascal(basename);
					return `export { default as ${exportAs} } from './${p}'`;
				});

			const source = iconExports.join('\n');

			// ESM
			compilation.assets['index.esm.js'] = {
				source() {
					return source;
				},
				size() {
					return source.length;
				},
			};

			// CJS
			babel.transform(source, {
				presets: [
					['@babel/preset-env', {
						targets: {
							node: true,
						},
					}],
				],
			}, (err, {code}) => {
				if (err) {
					return cb(err);
				}

				compilation.assets['index.js'] = {
					source() {
						return code;
					},
					size() {
						return code.length;
					},
				};
			});

			cb();
		});
	}
}

module.exports = EntryFile;
