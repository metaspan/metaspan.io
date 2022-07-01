// import Vue from 'vue'
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect'
// import { ApiPromise } from '@polkadot/api'
import { ApiPromise, WsProvider } from '@polkadot/api'

// import store from '../store'

type TEndpoints = Record<string, Record<string, string>>
const endpoints: TEndpoints = {
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

class SubstrateAPI {
  // eslint-disable-next-line
  config: any = {
    chain: 'kusama',
    endpoint: 'onFinality'
  }

  // eslint-disable-next-line
  api: any
  // eslint-disable-next-line
  kusama: any
  // eslint-disable-next-line
  polkadot: any

  // eslint-disable-next-line
  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async createWsProvider (chain: string) {
    const provider = new WsProvider(endpoints[chain].parity)
    provider.on('error', (err) => {
      console.debug(`plugins/polkadot.ts: substrate-connect (${chain}) error follows:`)
      console.error(err)
    })
    console.debug(`${chain}: debug 2`)
    provider.on('connected', async () => {
      console.debug(`plugins/polkadot.ts: substrate-connect  (${chain}) connected`)
      // await store.dispatch('apiConnected')
    })
    console.debug(`${chain}: debug 3`)
    provider.on('disconnected', async (evt) => {
      console.debug(`plugins/polkadot.ts: substrate-connect  (${chain}) disconnected`)
      console.debug(evt)
      // await store.dispatch('apiDisconnected')
    })
    console.debug(`${chain}: debug 4`)
    await provider.connect()
    console.debug(`${chain}: debug 5`)
    this[chain] = await ApiPromise.create({ provider })
    console.debug(`${chain}: debug 6`)
    return provider
  }

  async createScProvider (chain: string): Promise<ScProvider> {
    const provider = new ScProvider(WellKnownChain[chain])
    console.debug(`${chain}: debug 1`)
    provider.on('error', (err) => {
      console.debug(`plugins/polkadot.ts: substrate-connect (${chain}) error follows:`)
      console.error(err)
    })
    console.debug(`${chain}: debug 2`)
    provider.on('connected', async () => {
      console.debug(`plugins/polkadot.ts: substrate-connect  (${chain}) connected`)
      // await store.dispatch('apiConnected')
    })
    console.debug(`${chain}: debug 3`)
    provider.on('disconnected', async (evt) => {
      console.debug(`plugins/polkadot.ts: substrate-connect  (${chain}) disconnected`)
      console.debug(evt)
      // await store.dispatch('apiDisconnected')
    })
    console.debug(`${chain}: debug 4`)
    await provider.connect()
    console.debug(`${chain}: debug 5`)
    this[chain] = await ApiPromise.create({ provider })
    console.debug(`${chain}: debug 6`)
    return provider
  }

  async connect (): Promise<void> {
    // const wsProvider = new WsProvider(endpoints[this.config.chain][this.config.endpoint])
    // const kusamaProvider = await this.createProvider(WellKnownChain.ksmcc3)
    // const polkadotProvider = await this.createProvider(WellKnownChain.polkadot)
    // await Promise.all([this.createProvider(WellKnownChain.ksmcc3), this.createProvider(WellKnownChain.polkadot)])
    await Promise.all([this.createWsProvider('kusama'), this.createWsProvider('polkadot')])

    // this.api = await ApiPromise.create({ kusamaProvider })
    // this.kusama = await ApiPromise.create({ provider: kusamaProvider })
    // this.polkadot = await ApiPromise.create({ provider: polkadotProvider })
    console.debug('plugins/polkadot.ts: connect(): we have an api...')
  }
}

export { SubstrateAPI }
