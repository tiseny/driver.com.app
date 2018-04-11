const path = require('path')
module.exports = {
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: false,
    cssSourceMap: false,
    assetsPublicPath: '/', // 开发环境的PublicPath为'/'
    proxyTable: {
      '/api': {
        //target: 'http://dmp-admin-dev.mypaas.com.cn',
        target: 'https://api2.wlwulian.com',
        changeOrigin: true,

        //修改代理响应头cookie域名与开发域名一致，方便登录认证
        cookieDomainRewrite:'127.0.0.1', 
        /*pathRewrite: {
          '^/api': '/'
        }*/
      }
    }
  },
  build: {
    env: require('./prod.env'),
    assetsRoot: path.resolve(__dirname, '../dist/'), // 打包到项目根目录下的dist文件夹
    assetsPublicPath: '', // 正式上线版本PublicPath未知 暂时留空
    productionSourceMap: false,
  }
}
