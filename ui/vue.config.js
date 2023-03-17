const { defineConfig } = require('@vue/cli-service')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const IgnorePlugin = require('webpack').IgnorePlugin
const DefinePlugin = require('webpack').DefinePlugin

const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

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
      // new BundleAnalyzerPlugin(),
      // // new VuetifyLoaderPlugin()
      // new IgnorePlugin({ resourceRegExp: /moment\/locale\// }),
      // new DefinePlugin({
      //   'process.env': {
      //     PACKAGE_VERSION: '"' + version + '"'
      //   }
      // })
    ],
    resolve: {
      alias: {
        moment: 'moment/src/moment'
      },
      fallback: {
        "path": require.resolve("path-browserify")
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
