import { Plugin } from 'vue'
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

export interface ISubstrateAPI {
  // chains: Record<string,ApiPromise | undefined>
  chainId: string
  connected: boolean
  api: ApiPromise | undefined
  // kusama: any
  // polkadot: number
}

class SubstrateAPI implements ISubstrateAPI {
  // eslint-disable-next-line
  config: any = {
    lite: false,
    chain: 'kusama',
    endpoint: 'dotters'
  }

  connected: boolean = false
  chainId: string = 'kusama'
  api: ApiPromise | undefined

  constructor (options: any) {
    this.config = { ...this.config, ...options }
  }

  async createWsProvider (chainId = 'kusama', endpoint = 'parity') {
    console.debug('plugins/substrate.ts: createWsProvider()', chainId, endpoint)
    if (this.chainId === chainId && this.api) {
      console.debug('plugins/substrate.ts: we already have api for', chainId)
      await this.api.isReady
      return this.api
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
      this.connected = true
      console.debug(`plugins/substrate.ts: on('connected', ${chainId})`)
      await store.dispatch('substrate/apiConnected', chainId)
    })
    // console.debug(`${chain}: debug 3`)
    provider.on('disconnected', async (evt) => {
      this.connected = false
      console.debug(`plugins/substrate.ts: on('disconnected', ${chainId})`)
      console.debug(evt)
      await store.dispatch('substrate/apiDisconnected', chainId)
    })

    console.debug('plugins/substrate.ts: about to connect api', chainId)
    // if (!provider.isConnected) await provider.connect()
    const api = await ApiPromise.create({ provider, noInitWarn: true, throwOnConnect: false })
    api.on('connected', () => { 
      console.debug('substate api connected')
      this.connected = true })
    api.on('disconnected', () => {
      console.debug('substate api disconnected')
      this.connected = false
    })

    await api.isReady
    console.debug(`subsrate.ts: createWsProvider(${chainId}) api isReady`)
    this.api = api // TODO duplication!
    // console.debug(`${chain}: debug 6`)
    return api
  }

  async connect (chainId = 'kusama'): Promise<void> {
    console.debug('plugins/substrate.ts: connect()', chainId)
    const api = await this.createWsProvider(chainId, this.config.endpoint)
    this.api = api
    console.debug(`plugins/substrate.ts: connect(${chainId}): we have an api...`)

    const ci = await this.chainInfo(chainId)
    return ci
  }

  // eslint-disable-next-line
  async chainInfo (chainId: string): Promise<any> {
    console.debug('plugins/substrate.ts: chainInfo()', chainId)
    // const chainInfo = await this[chain].api.registry.getChainProperties()
    const chainInfo = await this.api?.registry.getChainProperties()
    console.debug(`plugins/substrate.ts: chainInfo(${chainId})`, chainInfo)
    return chainInfo
  }
}

export const SubstratePlugin: Plugin = {
  install: (app, options) => {
    const substrate = new SubstrateAPI(options)
    app.provide('$substrate', substrate)
  }
}

export { SubstrateAPI }
