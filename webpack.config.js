const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //提取单独的css
const HtmlWebpackPlugin = require('html-webpack-plugin'); //webpack中生成HTML的插件
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 相关配置
const CONFIG = require('./config');
// 判断是否为生产环境
const IS_PROD = process.env.PRODUCTION == 'production';

//获取entry
const entries = function() {
  var entry = {
    vendors: [
      path.resolve(__dirname, 'src/libs/mui.min.js')
    ] 
  };
  getEntry(CONFIG.devPath + 'pages/', function(list) {
    for (var i = 0, item; item = list[i++];) {
      const key = item[0]
      entry[key] = item[2] + '/index.js';
    }
  });
  return entry;
}();

const chunks = Object.keys(entries);
const CFG = {
  // 调试时显示源文件代码映射
  devServer: {
    outputPath: path.join(__dirname, CONFIG.distPath),
    contentBase: CONFIG.devPath,
    publicPath: CONFIG.publicPath,
    inline: true,   // 将JS注入到 body 或 head
    hot: true,
    stats: {        // node 编译时的提示
      cached: false,
      colors: true
    }
  },
  entry: entries,
  output: {
    path: CONFIG.distPath,
    publicPath: '../',
    filename: 'js/[hash:8].[name].js', // 最后的链接就是  publicPath + filename的结果  比如 ""./js/vendors.js?8ea677fd05e1a89a1235""
    chunkFilename: '[id].chunk.js' // 最后的链接就是  publicPath + chunkFilename的结果
  },
  module: {
    loaders: [ //加载器
      {
        test: /\.js?$/,
        //排除目录,exclude后将不匹配
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015'
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('exports-loader?module.exports.toString()', 'css-loader')
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css!less')
      }, {
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=fonts/[name].[ext]'
      }, {
        test: /\.(png|jpe?g|gif)$/,
        loader: 'url-loader?limit=1024&name=images/[name].[ext]?[hash]'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ //载入jq,这样就不用每个里面都require了，直接使用  $
      'mui': 'mui'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
      chunks: ["vendors"], //chunks 看起来就是这样 ["a", "b", "index"],
    }),
    new ExtractTextPlugin('css/[hash:8].[name].css') //单独使用link标签加载css并设置路径，相对于output配置中的publickPath
  ]
}

//循环文件夹内的文件
function getEntry(path, cb) {
  var folder_exists = fs.existsSync(path);
  var fileList = [];
  if (folder_exists == true) {
    var dirList = fs.readdirSync(path);
    dirList.forEach(function(fileName) {
      fileList.push([fileName, path, path + fileName]);
    });
  };
  return cb(fileList);
}
//删除文件夹 ，递归删除
function deleteFolderRecursive(path) {
  var files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files && files.forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse 查看文件是否是文件夹
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

//如果是生产环境，则开启压缩 + copy 对应的文件 
if (IS_PROD) {
    // 删除  dist目录
    deleteFolderRecursive(CONFIG.distPath);
    CFG.plugins.push(
      new webpack.optimize.UglifyJsPlugin({ //压缩JS代码
        output: {
          comments: false,  // remove all comments
        },
        sourceMap: false,
        minimize: true,
        compress: {
          drop_debugger: true,
          warnings: false,
          drop_console: true
        },          // 压缩JS
        mangle: {
          except: ['$super', '$', 'exports', 'require'] //排除关键字
        }
      }),
      new CopyWebpackPlugin([         // 复制文件夹到指定位置
        { from: CONFIG.devPath + 'images', to: 'images', toType: 'dir' },
        { from: CONFIG.devPath + 'fonts', to: 'fonts', toType: 'dir' },
        { from: CONFIG.devPath + 'static', to: 'static', toType: 'dir' },
        { from: CONFIG.devPath + 'unpackage', to: 'unpackage', toType: 'dir' },
        { from: CONFIG.devPath + 'manifest.json', to: '', toType: 'file' }
      ])
    );
} else {
  CFG.devtool = "cheap-module-eval-source-map";
  CFG.plugins.push(
    new webpack.HotModuleReplacementPlugin() //热加载
  )
}


//为每个页面配置html
getEntry('./src/pages/', function(list) {
  for (var i = 0, item; item = list[i++];) {
    const name = item[0]
    const sourcePath = `${CONFIG.devPath}pages/${name}/index.html`
    const distPath = `pages/${name}.html`

    CFG.plugins.push(new HtmlWebpackPlugin({ //根据模板插入css/js等生成最终HTML
      /*favicon: CONFIG.devPath + 'images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值*/
      filename: distPath, //生成的html存放路径，相对于path
      template: sourcePath, //html模板路径
      inject: true, //js插入的位置，true 'head'/  'body' false
      hash: true, //为静态资源生成hash值
      chunks: ['vendors', name], //需要引入的chunk，不配置就会引入所有页面的资源
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //删除空白符与换行符
        ignoreCustomFragments: [
          /\{\{[\s\S]*?\}\}/g //不处理 {{}} 里面的 内容
        ]
      }
    }));
  }
});

// 入口
module.exports = CFG;
