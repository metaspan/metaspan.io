import { defineStore } from 'pinia'

import { ApiPromise, WsProvider } from '@polkadot/api'
import moment from 'moment'

import { type ICache, type ICandidate, type IValidator } from '../types/global'
// import { PolkadotWindow, IValidator } from './types'

interface PolkadotWindow extends Window {
  $polkadot: any
//   name: string
//   salary: number
//   totalSalary: Function
//   display: Function
}
declare let window: PolkadotWindow

type IEndpoint = Record<string, string>

const endpoints: Record<string, IEndpoint> = {
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

interface IMinMax {
  min: number
  max: number
}

// type TRange = Record<string, IMinMax>
interface ILoading {
  key: 'api' | 'validator' | 'validators' | 'nominators' // string
  loading: boolean
}

interface IState {
  endpoints: Record<string, IEndpoint>,
  endpoint: string
  _loading: ILoading[]
  api: string
  list: ICandidate[]
  cache: ICache
  candidate: ICandidate | null
  nominators: string[]
  updatedAt: Date | string | null
  ranges: Record<string, IMinMax>
  validators: IValidator[],
  pagination: Record<string, number|string>
  options: Record<string, number|string|boolean>
  account: string | null
  filter: Record<string, number|string|boolean>
  search: string
  favourites: string[]
}

export const usePolkadotStore = defineStore('polkadot', {
  state: (): IState => ({
    endpoints: endpoints,
    endpoint: 'parity',
    _loading: [],
    api: '',
    list: [],
    cache: { items: {} },
    candidate: null,
    validators: [],
    nominators: [],
    updatedAt: null,
    ranges: {},
    pagination: {},
    options: {},
    account: null,
    filter: {},
    search: '',
    favourites: []
  }),
  getters: {
    loading (): boolean {
      return this._loading.filter((f: any) => f.loading === true).length > 0
    },
    // eslint-disable-next-line
    kusamaEndpoints (state: any): Record<string, string>[] {
      return Object.keys(state.endpoints.kusama).map((m) => {
        return {
          id: m,
          url: state.endpoints.kusama[m]
        }
      })
    }
  },
  actions: {
    async init (): Promise<void> {
    },
    async setEndpoint (endpoint: string): Promise<void> {
      if (this.endpoints[endpoint]) {
        // await commit('SET_ENDPOINT', endpoint)
        // this.endpoint = this.endpoints[endpoint]
        alert('setting endpoint not implemented')
        if (window.$polkadot) {
          // const isReady = await window.$polkadot.isReady
          console.debug('disconnecting api')
          await window.$polkadot.disconnect()
        }
        const wsProvider = new WsProvider(endpoint)
        const api = await ApiPromise.create({ provider: wsProvider })
        window.$polkadot = api
      }
    },
    async setValidator (stash: string): Promise<void> {
      // console.debug('polkadot.js actions.get', stash);
      if (!this.cache[stash] || moment().diff(moment(this.cache[stash].updatedAt), 'seconds') > 60) {
        try {
          // await commit('SET_LOADING', { key: 'validator', loading: true })
          this.setLoading({ key: 'validator', loading: true })
          try {
            const wsProvider = new WsProvider(endpoints.kusama[this.endpoint])
            const api = await ApiPromise.create({ provider: wsProvider })
            const account = await api.query.system.account(stash)
            // console.debug('account', account)
            // await commit('SET_CACHE', { stash: stash, model: account })
            this.setCache({ stash, model: account })
          } catch (err) {
            console.debug('error')
            console.error(err)
          }
          // console.debug("committed")
        } catch (err) {
          console.debug('OOPS, caught an error')
          console.error(err)
        } finally {
          // await commit('SET_LOADING', { key: 'validator', loading: false })
          this.setLoading({ key: 'validator', loading: false })
        }
      } else {
        console.debug('cache:', stash, 'is', moment().diff(moment(this.cache[stash].updatedAt), 'seconds'), 'secs old')
      }
    },
    setLoading({ key, loading }: ILoading): void {
      const idx = this.loading.findIndex((f: any) => f.key === key)
      if (idx > -1) {
        this.loading[idx].loading = loading
      } else {
        this.loading.push({ key, loading })
      }
    },
    async setNominators (): Promise<void> {
      // await commit('SET_LOADING', { key: 'nominators', loading: true })
      this.setLoading({ key: 'nominators', loading: true })
      const wsProvider = new WsProvider(endpoints.kusama[this.endpoint])
      const api = await ApiPromise.create({ provider: wsProvider })
      const keys = await api.query.staking.nominators.keys()
      console.debug('nominators.keys', keys)
      // await commit('SET_NOMINATORS', keys)
      this.nominators = keys.map((m) => m.toString())
      // await commit('SET_LOADING', { key: 'nominators', loading: false })
      this.setLoading({ key: 'nominators', loading: false })
    },
    // async setValidators ({ state, commit }: any): Promise<void> {
    //   // await commit('SET_LOADING', { key: 'validators', loading: true })
    //   this.setLoading({ key: 'validators', loading: true })
    //   const wsProvider = new WsProvider(endpoints.kusama[state.endpoint])
    //   const api = await ApiPromise.create({ provider: wsProvider })
    //   const list = await api.query.staking.validators()
    //   console.debug('validators', list)
    //   // await commit('SET_VALIDATORS', list)
    //   this.validators = list.map((m) => m.toString())
    //   await commit('SET_LOADING', { key: 'validators', loading: false })
    // }
  }
})
