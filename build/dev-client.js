/* eslint-disable */
require('eventsource-polyfill')
let hotClient = require('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
