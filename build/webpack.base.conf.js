const path = require('path')
const config = require('../config')
const Util = require('./utils.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')

function resolve(dir) {
  return path.resolve(__dirname, '..', dir)
}

// 获取js的入口文件
let jsFiles = Util.getAllFiles(resolve('src/pages'), 'js', true) // true 表示递归查找

let entry = Util.getEntry(jsFiles, filename => {
  return /\/(\w+)\.js$/.exec(filename).pop()
})

// 获取html的模板文件
let htmlFiles = Util.getAllFiles(resolve('src/pages'), 'html', true)
let htmlEntry = Util.getEntry(htmlFiles, filename => {
  return /\/(\w+)\.html$/.exec(filename).pop()
})
let htmlPlugins = []
for (let key in htmlEntry) {
  let options = {
    filename: key + '.html',
    template: htmlEntry[key],
    inject: true,
    hash: true, //为静态资源生成hash值
    minify: { //压缩HTML文件
      removeComments: true, //移除HTML中的注释
      collapseWhitespace: true, //删除空白符与换行符
      ignoreCustomFragments: [
        /\{\{[\s\S]*?\}\}/g //不处理 {{}} 里面的 内容
      ]
    }
  }
  if (entry.hasOwnProperty(key)) {
    options['chunks'] = ['vendors', key]
  } else {
    options['chunks'] = []
  }

  // 重新定义 title
  options['title'] = process.env.NODE_ENV

  htmlPlugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
    }),
    new HtmlWebpackPlugin(options)
  )
}

module.exports = {
  entry: {
    ...entry,
    vendors: [
      resolve('src/libs/mui.min.js'),
      resolve('src/libs/art.template.js')
    ] 
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].[hash:8].js',
    publicPath:
      process.env.NODE_ENV == 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    alias: {
      
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:7].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: process.env.NODE_ENV == 'production' ? '../fonts/[name].[ext]' : 'fonts/[name].[ext]'
        }
      }

      // {
      //   test: /\.html$/,
      //   loader: 'html-loader'
      // }
    ]
  },
  plugins: [...htmlPlugins]
}
