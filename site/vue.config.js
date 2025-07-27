module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': require('path').resolve(__dirname, 'src')
      }
    }
  },
  devServer: {
    allowedHosts: [
      'ztt.aimixtech.com',
      '192.168.10.187',
    ],
    host: '0.0.0.0',
    port: 8080
  }
}
