const merge = require("webpack-merge");
const path = require("path");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",

  output: {
    filename: "[name].js",
    chunkFilename: "[id].css"
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: ["style-loader",  {
          loader: "css-loader", options: {
            sourceMap: true
          }
        },
        {
            loader: "postcss-loader"
        },
        {
          loader: "sass-loader", options: {
            sourceMap: true
          }}]
      }
    ]
  },

  devServer: {
    port: process.env.PORT || 8080,
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
      cleanOnceBeforeBuildPatterns: [
        "dist/**/*.js",
        "dist/**/*.css",
        "site/content/webpack.json"
      ]}),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),

    new BundleAnalyzerPlugin()
  ]
});
