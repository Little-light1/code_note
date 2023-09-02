const {resolve} = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const {merge} = require('webpack-merge');
const commonConfigConstructor = require('./webpack.config');

process.env.NODE_ENV = 'production';

module.exports = merge(commonConfigConstructor(), {
    mode: 'production',

    devtool: 'source-map',

    plugins: [
        // css代码单独抽离
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            ignoreOrder: true, //Remove Order Warnings
        }),
        // // css代码压缩
        // new OptimizeCssAssetsWebpackPlugin(),
    ],
});
