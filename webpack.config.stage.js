const webpack = require('webpack');
const merge = require("webpack-merge");
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");

const generic = require("./webpack.generic");

module.exports = merge(generic, {
    mode: 'production',
    output: {
        filename: "[name].[hash:5].js",
        chunkFilename: "[id].[hash:5].css"
    },
    optimization: {
        minimizer: [

            new MiniCssExtractPlugin({
                filename: "[name].[hash:5].css",
                chunkFilename: "[id].[hash:5].css"
            }),

            new OptimizeCSSAssetsPlugin({})
        ]
    }

});
