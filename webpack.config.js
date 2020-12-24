const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = {
    output: {
        publicPath: '/',
        path: path.resolve(process.cwd(), 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tmpl\.xml$/,
                use: [{loader: 'fest-webpack-loader'}],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer],
                            },
                            sourceMap: true,
                        },
                    },
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'main.css',
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: './src/index.html',
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: 'offline.html',
        }),
        new CopyPlugin({
            patterns: [
                {from: './src/img', to: './img'},
            ],
        }),
        new ImageMinimizerPlugin({
            test: /\.(jpe?g|png|gif|svg)$/i,
            minimizerOptions: {
                plugins: [
                    ['gifsicle', {interlaced: true}],
                    ['jpegtran', {progressive: true}],
                    ['optipng', {optimizationLevel: 5}],
                    ['svgo', {plugins: [{removeViewBox: false}]}],
                ],
            },
        }),
        new InjectManifest({
            swSrc: './src/sw.js',
        }),
    ],
};
