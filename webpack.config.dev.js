// webpack v4
const path = require('path');
const merge = require("webpack-merge");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const  { CleanWebpackPlugin }  = require('clean-webpack-plugin');

const generic = require("./webpack.generic");

module.exports = merge(generic, {
    mode: "development",
    output: {
        filename: '[name].js',
        chunkFilename: "[id].css"
    },
    devServer: {
        port: process.env.PORT || 3000,
        contentBase: path.join(process.cwd(), "./dist"),
        watchContentBase: true,
        quiet: false,
        open: true,
        historyApiFallback: {
            rewrites: [{from: /./, to: "404.html"}]
        }
    },
    plugins: [

        new CleanWebpackPlugin({
            dangerouslyAllowCleanPatternsOutsideProject: false,
            cleanOnceBeforeBuildPatterns: [
                "dist/**/*.js",
                "dist/**/*.css",
                "site/content/webpack.json"
            ]}),


        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),

        //new BundleAnalyzerPlugin(),
    ]
});
