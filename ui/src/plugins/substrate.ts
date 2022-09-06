// import Vue from 'vue'
import { ScProvider, WellKnownChain } from '@polkadot/rpc-provider/substrate-connect'
// import { ApiPromise } from '@polkadot/api'
import { ApiPromise, WsProvider } from '@polkadot/api'

import store from '../store'

type TEndpoints = Record<string, Record<string, string>>
const endpoints: TEndpoints = {
  polkadot: {
    parity: 'wss://rpc.polkadot.io',
    onFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    dwellir: 'wss://polkadot-rpc.dwellir.com'
  },
  kusama: {
    // local: 'wss://192.168.1.85:30225',
    // local: 'http://192.168.1.85:40224',
    onFinality: 'wss://kusama.api.onfinality.io/public-ws',
    parity: 'wss://kusama-rpc.polkadot.io',
    dwellir: 'wss://kusama-rpc.dwellir.com'
  },
  parallel: {
    onFinality: 'wss://parallel.api.onfinality.io/public-ws'
  }
}

class SubstrateAPI {
  // eslint-disable-next-line
  config: any = {
    lite: false,
    chain: 'kusama',
    endpoint: 'onFinality'
  }

  // // eslint-disable-next-line
  // api: any
  // eslint-disable-next-line
  kusama: any
  // eslint-disable-next-line
  polkadot: any

  // eslint-disable-next-line
  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async createWsProvider (chain = 'kusama', endpoint = 'parity') {
    // const _chain = chain || 'kusama'
    // const _endpoint = endpoint || 'parity'
    console.debug('plugins/substrate.ts: createWsProvider()', chain, endpoint)
    if (this[chain]) {
      console.debug('plugins/substrate.ts: we already have api for', chain)
      await this[chain].isReady
      return
    }
    const provider = new WsProvider(endpoints[chain][endpoint])
    provider.on('error', async (err) => {
      console.warn(`plugins/substrate.ts: on('error', ${chain})`)
      await store.dispatch('apiError', { chain, error: err })
      console.error(err)
    })
    // console.debug(`${chain}: debug 2`)
    provider.on('connected', async () => {
      console.debug(`plugins/substrate.ts: on('connected', ${chain})`)
      await store.dispatch('substrate/apiConnected', { chain })
    })
    // console.debug(`${chain}: debug 3`)
    provider.on('disconnected', async (evt) => {
      console.debug(`plugins/substrate.ts: on('disconnected', ${chain})`)
      console.debug(evt)
      await store.dispatch('substrate/apiDisconnected', { chain })
    })
    console.debug('plugins/substrate.ts: about to connect', chain)
    await provider.connect()
    const api = await ApiPromise.create({ provider })
    await api.isReady
    this[chain] = api
    // console.debug(`${chain}: debug 6`)
    // return provider
  }

  // async createScProvider (chain: string): Promise<ScProvider> {
  //   console.debug('plugins/substrate.ts: createScProvider()', chain)
  //   const provider = new ScProvider(chain === 'polkadot' ? WellKnownChain.polkadot ? WellKnownChain.ksmcc3)
  //   // console.debug(`${chain}: debug 1`)
  //   provider.on('error', async (err) => {
  //     console.debug(`plugins/substrate.ts: substrate-connect (${chain}) error follows:`)
  //     await store.dispatch('apiError', { chain, error: err })
  //     console.error(err)
  //   })
  //   // console.debug(`${chain}: debug 2`)
  //   provider.on('connected', async () => {
  //     console.debug(`plugins/substrate.ts: substrate-connect  (${chain}) connected`)
  //     await store.dispatch('apiConnected', { chain })
  //   })
  //   // console.debug(`${chain}: debug 3`)
  //   provider.on('disconnected', async (evt) => {
  //     console.debug(`plugins/substrate.ts: substrate-connect  (${chain}) disconnected`)
  //     if (evt) { console.debug(evt) }
  //     await store.dispatch('apiDisconnected', { chain, evt })
  //   })
  //   // console.debug(`${chain}: debug 4`)
  //   await provider.connect()
  //   // console.debug(`${chain}: debug 5`)
  //   const api = await ApiPromise.create({ provider })
  //   await api.isReady
  //   this[chain] = api
  //   // console.debug(`${chain}: debug 6`)
  //   return provider
  // }

  async connect (chain = 'kusama'): Promise<void> {
    // const wsProvider = new WsProvider(endpoints[this.config.chain][this.config.endpoint])
    // const kusamaProvider = await this.createProvider(WellKnownChain.ksmcc3)
    // const polkadotProvider = await this.createProvider(WellKnownChain.polkadot)
    // if (this.config.lite) {
    //   // await Promise.all([this.createScProvider(WellKnownChain.ksmcc3), this.createScProvider(WellKnownChain.polkadot)])
    //   // await this.createScProvider(WellKnownChain.ksmcc3)
    //   // await this.createScProvider(WellKnownChain.polkadot)
    //   await this.createScProvider(chain === 'polkadot' ? WellKnownChain.polkadot : WellKnownChain.ksmcc3)
    // } else {
    // await Promise.all([
    // await this.createWsProvider('kusama')
    // await this.createWsProvider('polkadot')
    await this.createWsProvider(chain)
    // ])
    // }

    // this.api = await ApiPromise.create({ kusamaProvider })
    // this.kusama = await ApiPromise.create({ provider: kusamaProvider })
    // this.polkadot = await ApiPromise.create({ provider: polkadotProvider })
    console.debug('plugins/substrate.ts: connect(): we have an api...')
  }

  // eslint-disable-next-line
  async chainInfo (chain: string): Promise<any> {
    console.debug('plugins/substrate.ts: chainInfo()', chain)
    const chainInfo = await this[chain].api.registry.getChainProperties()
    console.log(chainInfo)
    return chainInfo
  }
}

export { SubstrateAPI }
