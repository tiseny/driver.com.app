const path = require('path')
module.exports = {
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    cssSourceMap: false,
    assetsPublicPath: '/' // 开发环境的PublicPath为'/'
  },
  build: {
    env: require('./prod.env'),
    assetsRoot: path.resolve(__dirname, '../dist/'), // 打包到项目根目录下的dist文件夹
    assetsPublicPath: '', // 正式上线版本PublicPath未知 暂时留空
    productionSourceMap: false,
  }
}
