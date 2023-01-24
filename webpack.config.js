/* eslint-disable */
const MinCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            { test: /\.css$/, use: [MinCssExtractPlugin.loader, 'css-loader'] },
            { test: /\.js$/, exclude: '/node_modules/', loader: 'babel-loader'},
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
            
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new MinCssExtractPlugin()
    ]

};