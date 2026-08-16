const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
	entry: ['babel-polyfill', './src/scripts/App.js'],
	output: {
		path: path.join(__dirname, '/docs/'),
		filename: '[name].[hash].js'
	},
	
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './docs'
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				styles: {
					name: 'styles',
					test: /\.css$/,
					chunks: 'all',
					enforce: true
				}
			}
		},

		minimizer: [
		new UglifyJsPlugin({
			uglifyOptions: {
				output: {
					comments: false,
					beautify: false
				},

				cache: true,
				sourceMap: true


			}
		}),
		new OptimizeCSSAssetsPlugin({
			assetNameRegExp: /\.css$/g,
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: { removeAll: true } },
			canPrint: true
		})
		]
	},

	plugins: [
		new CleanWebpackPlugin('docs', {} ),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		}),
		new MiniCssExtractPlugin({
		  filename: 'styles.[hash].css',
		 // chunkFilename: "[id].css"
		}),
		new FaviconsWebpackPlugin({
				logo: './src/news-icon.png',
				prefix: 'favicon-[hash]/',
				persistentCache: true,
				inject: true,
				icons: {
					android: true,
					appleIcon: true,
					appleStartup: false,
					coast: false,
					favicons: true,
					firefox: true,
					opengraph: false,
					twitter: false,
					yandex: false,
					windows: false
				}
		})
	],

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.scss$/,
				use:  [  'style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
			},
			{
			test: /\.(png|jpg|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 8192
					}
				}]
			},
			{
				test: /\.svg/,
				use: {
					loader: 'svg-url-loader',
					options: {}
				}
			},
		]
	}

}