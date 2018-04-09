module.exports = {
  serverHostName: 'localhost',
  serverPort: 8080,
  publicPath: 'http://localhost:8080/',
  devPath: './src/',
  distPath: './dist/',
  dev: {
    host: '127.0.0.1',
    port: 5006,
    autoOpenBrowser: true,
    /*proxyTable: {
      '/api': {
        //target: 'http://dmp-admin-dev.mypaas.com.cn',
        target: 'https://bms4cs.zhiduotong.net/api',
        changeOrigin: true,

        //修改代理响应头cookie域名与开发域名一致，方便登录认证
        cookieDomainRewrite:'127.0.0.1', 
        pathRewrite: {
          '^/api': '/'
        }
      }
    },*/
    cssSourceMap: true
  }
}
