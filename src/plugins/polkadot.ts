// import Vue from 'vue'
import { ApiPromise, WsProvider } from '@polkadot/api'

const endpoints: any = {
  polkadot: {
    parity: 'wss://rpc.polkadot.io',
    onFinality: 'wss://polkadot.api.onfinality.io/public-ws'
  },
  kusama: {
    // local: 'wss://192.168.1.85:30225',
    // local: 'http://192.168.1.85:40224',
    onFinality: 'wss://kusama.api.onfinality.io/public-ws',
    parity: 'wss://kusama-rpc.polkadot.io'
  },
  parallel: {
    onFinality: 'wss://parallel.api.onfinality.io/public-ws'
  }
}

class PolkadotAPI {
  config: any = {
    chain: 'kusama',
    endpoint: 'onFinality'
  }

  api: any

  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async connect () {
    const wsProvider = new WsProvider(endpoints[this.config.chain][this.config.endpoint])
    this.api = await ApiPromise.create({ provider: wsProvider })
    console.debug('we have an api?')
  }
}

export { PolkadotAPI }

// const polkadot = {
//     // created() {
//     //     console.debug('plugins/polkadot.js created')
//     // },
//     install: async (app, options) => {
//         console.debug('plugins/polkadot.js: install()...', options)

//         var chain = options.chain || 'kusama'
//         var endpoint = options.endpoint || 'onFinality'
//         // console.debug('=== polkadot api: chain', chain, 'endpoint', endpoint)

//         app.prototype.$polkadot = {
//             async created() {
//                 console.debug('plugins/polkadot.js created')
//                 const wsProvider = new WsProvider(endpoints[chain][endpoint])
//                 const api = await ApiPromise.create({ provider: wsProvider})
//                 this.api = api
//                 // let chaindata = await api.rpc.system.chain()
//                 // console.debug('chaindata', chaindata)
//                 // resolve(api)
//             },
//             mixins: {
//                 api() {return this.api},
//             },
//             data() {
//                 return {
//                     api: undefined,
//                     chain: chain,
//                     endpoint: endpoint,
//                 }
//             },
//             methods: {
//                 test() {
//                     console.debug('this is a test')
//                 }
//             },
//         })

//         // app.provide('polkadot', options)
//         console.debug('install() done...')
//     }
// }

// export default polkadot
