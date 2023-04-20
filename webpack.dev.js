const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path')
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: 'source-map',

  output: {
    filename: "[name].js",
    chunkFilename: "[id].css"
  },

  module: {
    rules: [
    {
      test: /\.(sa|sc|c)ss$/,
      exclude: /node_modules/,
      use: [MiniCssExtractPlugin.loader, {
        loader: "css-loader", options: {
          sourceMap: true,
          url: false
        }
      },
      {
          loader: "postcss-loader",options: {
          sourceMap: true,
        }
      },
      {
        loader: "resolve-url-loader",
        options: {
          sourceMap: true
        }
      },
      {
        loader: "sass-loader", options: {
          sourceMap: true
        }}]
    }
    ]
  },


  devServer: {
    port: process.env.PORT || 3100,
    static: path.join(process.cwd(), './dist'),
    hot: false,
    open: false,
    allowedHosts: 'auto',
    historyApiFallback: {
      rewrites: [{ from: /./, to: '404.html' }]
    }
  },

  plugins: [
    new BrowserSyncPlugin(
        // BrowserSync options
        {
          // browse to http://localhost:3000/ during development
          host: 'localhost',
          port: 8888,
          // proxy the Webpack Dev Server endpoint
          // (which should be serving on http://localhost:3100/)
          // through BrowserSync
          proxy: 'http://localhost:3100/'
        },
        // plugin options
        {
          // prevent BrowserSync from reloading the page
          // and let Webpack Dev Server take care of this
          reload: false
        }
    ),
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
