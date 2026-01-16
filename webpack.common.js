const webpack = require("webpack");
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: {
    main: path.join(__dirname, "src", "index.js"),
    cms: path.join(__dirname, "src", "js", "cms.js")
  },

  output: {
    path: path.join(__dirname, "dist"),
    publicPath: ""
  },

  resolve: {
    alias: {
      'TweenLite': path.resolve('node_modules', 'gsap/gsap'),
      'TweenMax': path.resolve('node_modules', 'gsap/gsap'),
      'TimelineLite': path.resolve('node_modules', 'gsap/gsap'),
      'TimelineMax': path.resolve('node_modules', 'gsap/gsap'),
      'ScrollMagic': path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js'),
      'animation.gsap': path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js'),
      'debug.addIndicators': path.resolve('node_modules', 'scrollmagic/scrollmagic/minified/plugins/debug.addIndicators.min.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 30 * 1024,
          }
        },
        generator: {
          filename: 'images/[name].[fullhash:6][ext]',
        },
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      ImagesLoaded: "imagesLoaded",
    }),
    new HtmlWebpackPlugin({
      filename: 'admin/index.html',
      template: 'src/cms.html',
      inject: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname,'src', 'assets', 'images'),
          to: path.join(__dirname,'dist', 'images'),
          toType: 'dir',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname,'src', 'assets', 'fonts'),
          to: path.join(__dirname,'dist', 'fonts'),
          toType: 'dir',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['*.DS_Store', 'Thumbs.db'],
          },
        },
      ],
    }),
    new AssetsPlugin({
      filename: 'webpack.json',
      removeFullPathAutoPrefix: true,
      path: path.join(process.cwd(), 'site/data'),
      prettyPrint: true,
      update: true
    }),
  ]
};
