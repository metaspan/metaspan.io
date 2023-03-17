// import Vue from 'vue'
import { ScProvider } from '@polkadot/rpc-provider/substrate-connect'
// import { ApiPromise } from '@polkadot/api'
import { ApiPromise, WsProvider } from '@polkadot/api'

import store from '../store'

type TEndpoints = Record<string, Record<string, string>>
const endpoints: TEndpoints = {
  polkadot: {
    dotters: 'wss://rpc.dotters.network/polkadot',
    parity: 'wss://rpc.polkadot.io',
    onFinality: 'wss://polkadot.api.onfinality.io/public-ws',
    dwellir: 'wss://polkadot-rpc.dwellir.com'
  },
  kusama: {
    // local: 'wss://192.168.1.85:30225',
    // local: 'http://192.168.1.85:40224',
    dotters: 'wss://rpc.dotters.network/kusama',
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
    endpoint: 'dotters'
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

  async createWsProvider (chainId = 'kusama', endpoint = 'parity') {
    // const _chain = chain || 'kusama'
    // const _endpoint = endpoint || 'parity'
    console.debug('plugins/substrate.ts: createWsProvider()', chainId, endpoint)
    if (this[chainId]) {
      console.debug('plugins/substrate.ts: we already have api for', chainId)
      await this[chainId].isReady
      return this[chainId]
    }
    console.debug(`plugins/substrate.ts: not connected to ${chainId}, connecting...`)
    const provider = new WsProvider(endpoints[chainId][endpoint])
    provider.on('error', async (err) => {
      console.warn(`plugins/substrate.ts: on('error', ${chainId})`)
      await store.dispatch('apiError', { chainId, error: err })
      console.error(err)
    })
    // console.debug(`${chain}: debug 2`)
    provider.on('connected', async () => {
      console.debug(`plugins/substrate.ts: on('connected', ${chainId})`)
      await store.dispatch('substrate/apiConnected', chainId)
    })
    // console.debug(`${chain}: debug 3`)
    provider.on('disconnected', async (evt) => {
      console.debug(`plugins/substrate.ts: on('disconnected', ${chainId})`)
      console.debug(evt)
      await store.dispatch('substrate/apiDisconnected', chainId)
    })
    console.debug('plugins/substrate.ts: about to connect', chainId)
    // if (!provider.isConnected) await provider.connect()
    const api = await ApiPromise.create({ provider, noInitWarn: true, throwOnConnect: false })
    await api.isReady
    console.debug(`subsrate.ts: createWsProvider(${chainId}) api isReady`)
    this[chainId] = api // TODO duplication!
    // console.debug(`${chain}: debug 6`)
    return api
  }

  async connect (chainId = 'kusama'): Promise<void> {
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
    const api = await this.createWsProvider(chainId)
    this[chainId] = api
    console.debug(`plugins/substrate.ts: connect(${chainId}): we have an api...`)
    // ])
    // }

    // this.api = await ApiPromise.create({ kusamaProvider })
    // this.kusama = await ApiPromise.create({ provider: kusamaProvider })
    // this.polkadot = await ApiPromise.create({ provider: polkadotProvider })
    const ci = await this.chainInfo(chainId)
    return ci
  }

  // eslint-disable-next-line
  async chainInfo (chainId: string): Promise<any> {
    console.debug('plugins/substrate.ts: chainInfo()', chainId)
    // const chainInfo = await this[chain].api.registry.getChainProperties()
    const chainInfo = await this[chainId].registry.getChainProperties()
    console.debug(`plugins/substrate.ts: chainInfo(${chainId})`, chainInfo)
    return chainInfo
  }
}

export { SubstrateAPI }
