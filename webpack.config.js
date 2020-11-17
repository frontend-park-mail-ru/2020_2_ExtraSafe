const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');

// TODO: разобраться с мусорным <style>
module.exports = {
    output: {
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.tmpl\.xml$/,
                use: [{loader: 'fest-webpack-loader'}],
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new HtmlWebpackPlugin({
            // hash: true,
            template: './src/index.html',
        }),
        new CopyPlugin({
            patterns: [
                {from: './src/img', to: './img'},
            ],
        }),
        new InjectManifest({
            swSrc: './src/sw.js',
        }),
    ],
};
