var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	devtool: 'source-map',
	entry: {
		'index': [
			'babel-polyfill',
			'expose?Zone!zone.js',
			'reflect-metadata',
			'./src/index.es6.js'
		]
	},
	output: {
		path: './dist',
		filename: '[name].js',
		sourceMapFilename: '[file].map'
	},
	module: {
		loaders: [
			{
				test: /\.es6\.js$/,
				loader: 'babel',
				query: {
					cacheDirectory: true,
					presets: [
						'es2015',
						'stage-0'
					],
					plugins: [
						'angular2-annotations',
						'transform-decorators-legacy',
						'transform-class-properties',
						'transform-flow-strip-types'
					]
				}
			},
			{ test: /\.css$/,     loader: 'style!css!autoprefixer' },
			{ test: /\.png$/,     loader: 'url'                    },
			{ test: /^jquery$/,   loader: 'expose?$!expose?jQuery' },

			/* inject jQuery for libraries that need it */
			{ test: /golden-layout$/,                        loader: 'imports?jQuery=jquery' },
			{ test: /jquery\.balancetext\.js$/,              loader: 'imports?jQuery=jquery' },
			{ test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },

			/* bootstrap specific stuff */
			{ test: /\.scss$/,                               loader: 'style!css!autoprefixer!sass' },
			{ test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
			{ test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff" },
			{ test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
			{ test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
			{ test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" }
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title:    "Correlation Editor",
			filename: 'index.html'
		})
	]
};
