var webpack = require('webpack');
var path = require('path');

// var env = 'production';
var env =  process.env.NODE_ENV;

var config = {
	devtool: 'cheap-module-eval-source-map',
	entry: [
		// 'webpack-hot-middleware/client',
		'babel-polyfill',
		'./assets/js/main.js'
	],
	target: 'web',
	watchOptions: {
		poll: true,
		aggregateTimeout: 30
	},
	output: {
		path: path.join(__dirname, 'public/js/'),
		filename: 'build.js',
		chunkFilename: '[chunkhash].bundle.js'
	},
	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['node_modules', 'bower_components'],
		root: [
			path.resolve(__dirname, 'assets/js/'),
		],
		alias: {
			'first': 'modules/first'
		}
	},
	module: {
		loaders: [
			{ test: /\.gif$/, loader: 'url-loader?limit=300&name=[name].[ext]'},
			{ test: /\.png$/, loader: 'url-loader?limit=300&name=[name].[ext]'},
			{ test: /\.html$/, loader: 'html!posthtml' },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
			{ test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
			{
				test: /\.(js|jsx)$/,
				loader: 'babel',
				include: [
					path.resolve(__dirname, 'assets/js/')
				],
				plugins: ['transform-runtime', 'syntax-object-rest-spread'],
				query: {
					presets: ["es2015", "stage-0"]
				}
			}
		],
		noParse: /\.min\.js/
	},
	posthtml: function () {
		return {
			defaults: [ PostHTML ]
		}
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(env)
		}),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			__First: 'first'
		})
	]
}

if (env === 'production') {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			compressor: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false
			}
		})
	)
} else {
	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			sourceMap: true
		})
	)
}

module.exports = config;