const webpack = require('webpack');
const merge = require("webpack-merge");
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const  { CleanWebpackPlugin }  = require('clean-webpack-plugin');

const generic = require("./webpack.generic");

module.exports = merge(generic, {
    mode: 'production',
    output: {
        path: path.join(__dirname, "deploy"),
        filename: "[name].[hash:5].js",
        chunkFilename: "[id].[hash:5].css"
    },
    plugins : [
        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: false,
            cleanOnceBeforeBuildPatterns: [
                "deploy/*.js",
                "deploy/*.css",
            ]}),
    ],

    optimization: {
        minimizer: [

            new MiniCssExtractPlugin({
                filename: "[name].[hash:5].css",
                chunkFilename: "[id].[hash:5].css"
            }),

            new OptimizeCSSAssetsPlugin()
        ]
    }

});
