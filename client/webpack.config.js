/***********************
 * @name webpack dev配置文件
 * @author Jo.gel
 * @date 2020/1/21 0021
 ***********************/
const path = require('path');
const {VueLoaderPlugin} = require('vue-loader');                // vue-loader
const MiniCssExtractPlugin = require('mini-css-extract-plugin');// css
const HtmlWebpackPlugin = require('html-webpack-plugin');       // 生成index.html 到dist 目录
const CopyWebpackPlugin = require('copy-webpack-plugin');       // copy 文件
module.exports = (env = {}) => ({
	mode: env.prod ? 'production' : 'development',
	devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
	entry: path.resolve(__dirname, './src/main.js'),
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/',
	},
	resolve: {
		alias: {
			// is a simple `export * from '@vue/runtime-dom`. However having this
			// extra re-export somehow causes webpack to always invalidate the module
			// on the first HMR update and causes the page to reload.
			'vue': '@vue/runtime-dom'
		},
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(jpg|png|gif|svg)$/,
				use: {
					loader: 'url-loader',
					options: {limit: 8192}
				},
				include: path.resolve(__dirname + '/src/'),
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: !env.prod,
							publicPath: '/'
						}
						
					},
					'css-loader'
				],
				exclude: /node_modules/,
			},
			// 增加scss
			{
				test: /\.(scss)$/,
				use: ['vue-style-loader', 'css-loader', 'sass-loader'],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		// 生成index.html
		new HtmlWebpackPlugin({
			title: "关注2019新型冠状病毒(Focus 2019-nCoV)——大数据可视化",
			filename: "index.html",
			template: __dirname + "/public/index.html",
			chunks: ["app"],
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CopyWebpackPlugin([
			{
				from: __dirname + '/public',
				to: __dirname + '/dist',
			},
		])
	],
	devServer: {
		inline: true,
		hot: true,
		stats: 'minimal',
		contentBase: "dist",
		overlay: true,
		proxy: {
			// '/socket.io': 'http://127.0.0.1:9999/socket.io'
		}
	}
});
