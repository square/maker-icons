const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { getIconEntries } = require('./utils');
const EntryFile = require('./entry-file');

module.exports = {
	mode: 'production',

	entry: {
		...getIconEntries('./traced'),
	},

	output: {
		path: path.resolve(__dirname, '../'),
		libraryTarget: 'commonjs2',
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.svg$/,
				use: [
					'vue-loader',
					{
						loader: 'htmlvue-loader',
						options: { vPre: true },
					},
					{
						loader: 'svgo-loader',
						options: {
							// https://github.com/svg/svgo#what-it-can-do
							plugins: [
								{ removeViewBox: false },
								{ removeXMLNS: true },
								{ removeDimensions: true },
								{ sortAttrs: true },
								{
									removeAttrs: {
										attrs: 'svg:(class)',
									},
								},
							],
						},
					},
				],
			},
		],
	},

	plugins: [
		new VueLoaderPlugin(),
		new EntryFile(),
	],
};
