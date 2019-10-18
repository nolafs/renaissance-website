const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: path.join(__dirname, "src", "index.js"),
    cms: path.join(__dirname, "src", "js", "cms.js"),
  },

  output: {
    path: path.join(__dirname, "dist")
  },

  resolve: {
    alias: {
      "TweenLite": path.resolve('node_modules', 'gsap/gsap'),
      "TweenMax": path.resolve('node_modules', 'gsap/gsap'),
      "TimelineLite": path.resolve('node_modules', 'gsap/gsap'),
      "TimelineMax": path.resolve('node_modules', 'gsap/gsap'),
      "ScrollMagic": path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js'),
      "animation.gsap": path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js'),
      "debug.addIndicators": path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js')
    },
  },

  module: {



    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },

      {test: /\.json$/, loader: "json-loader"},

      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      }
    ]
  },

  plugins: [
   new webpack.ProvidePlugin({
     fetch: 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd',
   }),

    new AssetsPlugin({
      filename: "webpack.json",
      path: path.join(process.cwd(), "site/data"),
      prettyPrint: true
    }),

    new CopyWebpackPlugin([
      {
        from: "./src/assets/fonts/",
        to: "fonts/",
        flatten: true
      }
    ]),

    new CopyWebpackPlugin([
      {
        from: "./src/assets/images/",
        to: "images/",
        flatten: true
      }
    ]),

    new HtmlWebpackPlugin({
      filename: 'admin/index.html',
      template: 'src/cms.html',
      inject: false,
    }),
  ]
};
