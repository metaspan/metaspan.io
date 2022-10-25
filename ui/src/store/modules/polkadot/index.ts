
import { ApiPromise, WsProvider } from '@polkadot/api'
import moment from 'moment-timezone'

import { ICache, ICandidate } from '../../../types/global'
import { PolkadotWindow, IValidator } from './types'
declare let window: PolkadotWindow

// eslint-disable-next-line
const endpoints: Record<string, any> = {
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
  endpoints: Record<string, string>,
  endpoint: string
  loading: ILoading[]
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

/* eslint-disable no-new */
const polkadot = {
  namespaced: true,
  // async created() {
  //     const wsProvider = new WsProvider(endpoints.kusama.onFinality);
  //     const api = await ApiPromise.create({ provider: wsProvider });
  //     this.api = api;
  //     console.debug('store/modules/polkadot.js: created()...');
  // },
  state: {
    endpoints: endpoints,
    endpoint: 'parity',
    loading: [],
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
  } as IState,
  getters: {
    loading (state: IState): boolean {
      return state.loading.filter(f => f.loading === true).length > 0
    },
    // eslint-disable-next-line
    kusamaEndpoints (state: any): any {
      return Object.keys(state.endpoints.kusama).map((m) => {
        return {
          id: m,
          url: state.endpoints.kusama[m]
        }
      })
    }
  },
  mutations: {
    SET_LOADING (state: IState, item: ILoading): void {
      const idx = state.loading.findIndex(f => f.key === item.key)
      if (idx > -1) {
        state.loading[idx].loading = item.loading
      } else {
        state.loading.push(item)
      }
    },
    // eslint-disable-next-line
    SET_API (state: IState, api: any): void {
      state.api = api
    },
    SET_ENDPOINT (state: IState, endpoint: string): void {
      // state.endpoint = state.endpoints[endpoint]
      state.endpoint = endpoint
    },
    SET_LIST (state: IState, list: ICandidate[]): void {
      // console.debug("SET_LIST", list)
      let udata = [] as number[]
      let ranks = [] as number[]
      state.list = list
      state.updatedAt = new Date()

      ranks = list.map((m) => {
        return m.rank
      }).sort((a, b) => {
        return a - b
      })
      udata = [...new Set(ranks)]
      udata = udata.slice(udata.length * 0.055, udata.length * 0.854)
      console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      state.ranges.rank = { min: Math.min(...udata), max: Math.max(...udata) } as IMinMax
    },
    // eslint-disable-next-line
    SET_CACHE (state: IState, { stash, model }: any): void {
      // state.candidate = model
      // console.debug('SET_CACHE', model, 'loading', state.loading)
      state.cache.items[stash] = {
        updatedAt: new Date(),
        model: model
      }
    },
    SET_ACCOUNT (state: IState, account: string): void {
      state.account = account
    },
    SET_NOMINATORS (state: IState, keys: string[]): void {
      state.nominators = keys
    },
    SET_VALIDATORS (state: IState, list: IValidator[]): void {
      state.validators = list
    },
    SET_PAGINATION (state: IState, pagination: Record<string, number|string>): void {
      state.pagination = pagination
    },
    SET_OPTIONS (state: IState, options: Record<string, number|string|boolean>): void {
      state.options = options
    },
    SET_FILTER (state: IState, filter: Record<string, number|string|boolean>): void {
      state.filter = filter
    },
    SET_SEARCH (state: IState, search: string): void {
      state.search = search
    },
    TOGGLE_FAV (state: IState, stash: string): void {
      const idx = state.favourites.findIndex((v: string) => {
        return v === stash
      })
      // console.debug('idx', idx);
      if (idx > -1) {
        state.favourites = state.favourites.filter((f: string) => {
          return f !== stash
        })
      } else {
        state.favourites.push(stash)
      }
    }
  },
  actions: {
    // async init (): Promise<void> {
    //   console.warn('store/modules/polkadot.ts: init() we dont need this')
    //   if (window.$polkadot) {
    //     // const isReady = await window.$polkadot.isReady
    //     // console.debug('isReady', isReady)
    //     await window.$polkadot.disconnect()
    //   }
    //   // try {
    //   //   await commit('SET_LOADING', true)
    //   //   // let res = await axios.get(`${baseUrl}/candidates`)
    //   //   // let res = ApiPromise()
    //   //   const wsProvider = new WsProvider(endpoints.kusama[state.endpoint] as string)
    //   //   const api = await ApiPromise.create({ provider: wsProvider })
    //   //   api.on('error', (ctx: any) => {
    //   //     console.debug('api error', ctx)
    //   //   })
    //   //   await commit('SET_API', api)
    //   //   // // console.debug(res.data)
    //   //   // if(res.data) await commit('SET_LIST', res.data)
    //   //   // console.debug('committed');
    //   // } catch (err) {
    //   //   console.debug('OOPS, caught an error')
    //   //   console.error(err)
    //   // } finally {
    //   //   await commit('SET_LOADING', false)
    //   // }
    // },
    // eslint-disable-next-line
    async setEndpoint ({ state, commit, dispatch }: any, endpoint: string): Promise<void> {
      if (state.endpoints[endpoint]) {
        await commit('SET_ENDPOINT', endpoint)
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
    // async getActiveEra({state}) {
    //     const wsProvider = new WsProvider(endpoints.kusama[state.endpoint]);
    //     const api = await ApiPromise.create({ provider: wsProvider});
    //     // Retrieve the active era
    //     const activeEra = await api.query.staking.activeEra();
    //     // console.debug('activeEra', activeEra)
    //     // retrieve all exposures for the active era
    //     const exposures = await api.query.staking.erasStakers.entries(activeEra.value.index);
    //     // console.debug('exposures', exposures);
    //     // exposures.forEach(([key, exposure]) => {
    //     //     console.log('key arguments:', key.args.map((k) => k.toHuman()));
    //     //     console.log('     exposure:', exposure.toHuman());
    //     // });
    //     // console.debug('activeEra', activeEra)
    // },
    // eslint-disable-next-line
    async setValidator ({ state, commit }: any, stash: string): Promise<void> {
      // console.debug('polkadot.js actions.get', stash);
      if (!state.cache[stash] || moment().diff(moment(state.cache[stash].updatedAt), 'seconds') > 60) {
        try {
          await commit('SET_LOADING', { key: 'validator', loading: true })
          try {
            const wsProvider = new WsProvider(endpoints.kusama[state.endpoint])
            const api = await ApiPromise.create({ provider: wsProvider })
            const account = await api.query.system.account(stash)
            // console.debug('account', account)
            await commit('SET_CACHE', { stash: stash, model: account })
          } catch (err) {
            console.debug('error')
            console.error(err)
          }
          // console.debug("committed")
        } catch (err) {
          console.debug('OOPS, caught an error')
          console.error(err)
        } finally {
          await commit('SET_LOADING', { key: 'validator', loading: false })
        }
      } else {
        console.debug('cache:', stash, 'is', moment().diff(moment(state.cache[stash].updatedAt), 'seconds'), 'secs old')
      }
    },
    // eslint-disable-next-line
    async nominators ({ state, commit }: any): Promise<void> {
      await commit('SET_LOADING', { key: 'nominators', loading: true })
      const wsProvider = new WsProvider(endpoints.kusama[state.endpoint])
      const api = await ApiPromise.create({ provider: wsProvider })
      const keys = await api.query.staking.nominators.keys()
      console.debug('nominators.keys', keys)
      await commit('SET_NOMINATORS', keys)
      await commit('SET_LOADING', { key: 'nominators', loading: false })
    },
    // eslint-disable-next-line
    async validators ({ state, commit }: any): Promise<void> {
      await commit('SET_LOADING', { key: 'validators', loading: true })
      const wsProvider = new WsProvider(endpoints.kusama[state.endpoint])
      const api = await ApiPromise.create({ provider: wsProvider })
      const list = await api.query.staking.validators()
      console.debug('validators', list)
      await commit('SET_VALIDATORS', list)
      await commit('SET_LOADING', { key: 'validators', loading: false })
    }
  }
}

export default polkadot
