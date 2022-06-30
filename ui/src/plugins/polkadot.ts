// import Vue from 'vue'
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect'
// import { ApiPromise, WsProvider } from '@polkadot/api'
import { ApiPromise } from '@polkadot/api'

// import store from '../store'

// type TEndpoints = Record<string, Record<string, string>>
// const endpoints: TEndpoints = {
//   polkadot: {
//     parity: 'wss://rpc.polkadot.io',
//     onFinality: 'wss://polkadot.api.onfinality.io/public-ws'
//   },
//   kusama: {
//     // local: 'wss://192.168.1.85:30225',
//     // local: 'http://192.168.1.85:40224',
//     onFinality: 'wss://kusama.api.onfinality.io/public-ws',
//     parity: 'wss://kusama-rpc.polkadot.io'
//   },
//   parallel: {
//     onFinality: 'wss://parallel.api.onfinality.io/public-ws'
//   }
// }

class PolkadotAPI {
  // eslint-disable-next-line
  config: any = {
    chain: 'kusama',
    endpoint: 'onFinality'
  }

  // eslint-disable-next-line
  api: any

  // eslint-disable-next-line
  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async connect (): Promise<void> {
    // const wsProvider = new WsProvider(endpoints[this.config.chain][this.config.endpoint])
    const provider = new ScProvider(WellKnownChain.ksmcc3)

    provider.on('error', (err) => {
      console.debug('plugins/polkadot.ts: substrate-connect error follows:')
      console.error(err)
    })

    provider.on('connected', async () => {
      console.debug('plugins/polkadot.ts: substrate-connect connected')
      // await store.dispatch('apiConnected')
    })

    provider.on('disconnected', async (evt) => {
      console.debug('plugins/polkadot.ts: substrate-connect disconnected')
      console.debug(evt)
      // await store.dispatch('apiDisconnected')
    })

    await provider.connect()
    this.api = await ApiPromise.create({ provider })
    console.debug('plugins/polkadot.ts: connect(): we have an api...')
  }
}

export { PolkadotAPI }
