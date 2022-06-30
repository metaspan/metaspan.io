const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    // domain: 'dev.local',
    host: '0.0.0.0',
    port: 8080,
    // https to enable camera
    // https: true,
    // https: {
    //   key: fs.readFileSync('./certs/dev.local+4-key.pem', 'utf-8'),
    //   cert: fs.readFileSync('./certs/dev.local+4.pem', 'utf-8'),
    //   // ca: fs.readFileSync('./certs/my-ca.crt')
    // },
    // disableHostCheck: true, // not allowed in vite?

    // proxy: {
    //   '^/api': {
    //     target: 'http://localhost:1337',
    //     changeOrigin: true
    //   },
    // }
  }
})
