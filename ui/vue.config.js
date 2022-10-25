const { defineConfig } = require('@vue/cli-service')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = defineConfig({

  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/ui'
  //   : '/',
  // outputDir: '../metaspan.github.io',
  
  transpileDependencies: true,
  runtimeCompiler: true,

  // https://www.jenniferbland.com/how-to-reduce-your-vue-js-bundle-size-with-webpack/
  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin(),
      // new VuetifyLoaderPlugin()
    ],
    resolve: {
      alias: {
        moment: 'moment/src/moment'
      }
    }
  },

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

    proxy: {
      '^/api': {
        // target: 'http://localhost:1337',
        target: 'https://api.metaspan.io',
        changeOrigin: true
      },
    }
  }
})
