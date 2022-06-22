// import fs from 'fs'
const fs = require('fs')

module.exports = {

  runtimeCompiler: true,

  configureWebpack: {
    module: {
      rules: [
  //       // https://vuetifyjs.com/en/getting-started/installation/#webpack-install
  //       // {
  //       //   test: /\.s(c|a)ss$/,
  //       //   use: [
  //       //     'vue-style-loader',
  //       //     'css-loader',
  //       //     {
  //       //       loader: 'sass-loader',
  //       //       // Requires >= sass-loader@^8.0.0
  //       //       options: {
  //       //         implementation: require('sass'),
  //       //         indentedSyntax: true, // optional
  //       //         sassOptions: {
  //       //           indentedSyntax: true // optional
  //       //         },
  //       //       },
  //       //     },
  //       //   ],
  //       // },

  //       // {
  //       //   test: /\.scss$/,
  //       //   use: ['vue-style-loader', 'css-loader', 'sass-loader']
  //       // },
  //       // {
  //       //     test: /\.sass$/,
  //       //     use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
  //       // },

  //       {
  //         test: /\.(js|vue)$/,
  //         loader: 'eslint-loader',
  //         enforce: 'pre',
  //         //include: [resolve('src'), resolve('test')],
  //         options: {
  //           //formatter: require('eslint-friendly-formatter'),
  //           // emitWarning: !config.dev.showEslintErrorsInOverlay,
  //           configFile: '.eslintrc.js'
  //         }
  //       },

        {
          test: /\.js$/,
          // test: /node_modules[/\\]@polkadot*.js$/,
          include: /node_modules[/\\|]@polkadot/i,
          loader: require.resolve('@open-wc/webpack-import-meta-loader'),
          // loader: '@open-wc/webpack-import-meta-loader',
          exclude: /\.vue$/,
        },

        {
          test: /\.m?js$/,
          include: /node_modules[/\\|]@polkadot/i,
          // exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@vue/cli-plugin-babel/preset',
              ],
              plugins: [
                "@babel/plugin-proposal-private-methods",
                "@babel/plugin-proposal-class-properties",
                '@babel/plugin-proposal-object-rest-spread',
              ]
            }
          }
        },

      ]
    }
  },

  // transpileDependencies: [
  //   'vuetify',
  //   // '@polkadot'
  // ],

  devServer: {
    // domain: 'dev.local',
    host: '0.0.0.0',
    port: 8080,
    // https: true,
    https: {
      key: fs.readFileSync('./certs/dev.local+4-key.pem', 'utf-8'),
      cert: fs.readFileSync('./certs/dev.local+4.pem', 'utf-8'),
      // ca: fs.readFileSync('./certs/my-ca.crt')
    },
    disableHostCheck: true,

    // proxy: {
    //   '^/api': {
    //     target: 'http://localhost:1337',
    //     changeOrigin: true
    //   },
    // }
  }

}
