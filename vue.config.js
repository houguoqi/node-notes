module.exports = {
    publicPath: process.env.VUE_APP_BASEURL || '/',
    // 修改webpack的配置
    configureWebpack: {
        // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
        externals: {
        'T': 'T'
        }
    },
    // devServer 选项单独配置
    devServer: {
        https: false,
        proxy: { // 代理 如果process.env.VUE_APP_API_URL是www.hgqweb.cn的话，那么/sys/login 就相当于 www.hgqweb.cn/login
            '/sys': {
                target: process.env.VUE_APP_API_URL,//这个是全局的环境配置变量，单独建立的文件，以VUE_APP_开头的变量，每个文件中都可以访问
                changeOrigin: true,
                onProxyReq: function (proxyReq) {
                proxyReq.removeHeader('origin')
                }
            }
        },
        before: app => {
        // applyMock(app)
        }
    }
}