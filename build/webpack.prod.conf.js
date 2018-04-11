const path = require('path')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')

const webpack = require('webpack')
const merge = require('webpack-merge')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

let webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract('exports-loader?module.exports.toString()', 'css-loader')
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            "css-loader",
            "less-loader"
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[hash:8].css',
      allChunks: true
    }),
    /*new webpack.optimize.UglifyJsPlugin({
      uglifyOptions: {
        output: {
          comments: false,  // remove all comments
        },
        sourceMap: false,
        minimize: true,
        compress: {
          warnings: false,
          drop_console: true,
          dead_code: true
        },
        mangle: {
          except: ['$super', '$', 'exports', 'require']
        }
      }
    }),*/
    new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
      root: path.resolve(__dirname, '../')
    }),
    new CopyWebpackPlugin([         // 复制文件夹到指定位置
      { from: './src/images', to: 'images', toType: 'dir' },
      { from: './src/fonts', to: 'fonts', toType: 'dir' },
      { from: './src/static', to: 'static', toType: 'dir' },
      { from: './src/unpackage', to: 'unpackage', toType: 'dir' },
      { from: './src/manifest.json', to: '', toType: 'file' }
    ])
  ]
})
module.exports = webpackConfig
