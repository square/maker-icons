const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
	mode: 'production',

	resolve: {
		alias: {
			'feather-icons': 'feather-icons/dist/icons/',
		},
	},

	entry: {
		'index': './src/index',
	},

	output: {
		path: path.resolve('dist'),
		libraryTarget: 'umd',
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
		new CleanWebpackPlugin(),
	],
};
