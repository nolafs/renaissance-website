const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require ('imagemin-mozjpeg');
const CompressionPlugin = require('compression-webpack-plugin');
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "production",

  output: {
    filename: "[name].[fullhash:5].js",
    chunkFilename: "[id].[fullhash:5].css"
  },

  module: {
    rules: [
     {
       test: /\.(sa|sc|c)ss$/,
       exclude: /node_modules/,
       use: [MiniCssExtractPlugin.loader, {
         loader: 'css-loader',
         options: {
           url: false
         }
       }, 'postcss-loader', 'sass-loader'],
     }
    ]
  },

  optimization: {
    minimizer: [

      new TerserPlugin({
        parallel: true,
      }),

      new MiniCssExtractPlugin({
        filename: "[name].[fullhash:5].css",
        chunkFilename: "[id].[fullhash:5].css"
      }),

      new CssMinimizerPlugin(),
    ]
  },
  plugins: [
    new ImageminPlugin({
      test: /\.(png|gif|svg)$/i,
      disable: false,
      pngquant: {
        quality: '75',
      }
    }),
    new CompressionPlugin({
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});
