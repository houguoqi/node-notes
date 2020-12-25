'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_URL: '"http://www.hgqweb.cn:3688"' // 配置公共请求域名地址，全局变量
})
