
// import moment from 'moment-timezone'
import Vue from 'vue'
import { IPool } from '@/types/global'
// import axios from 'axios'
// import { stat } from 'fs'
// import { SubstrateAPI } from '../../plugins/substrate'

interface IPagination {
  page: number
  itemsPerPage: number
}

interface IOptions {
  page: number
  itemsPerPage: number
  sortBy: string
  sortDesc: boolean
}

interface IFilter {
  valid: boolean
  active: boolean
}

interface IChainState {
  apiConnected: boolean
  updatedAt: null|Date
  loading: boolean
  pagination: IPagination
  options: IOptions,
  search: string
  filter: IFilter
  // // ranges: TRanges // Record<string, IMinMax>
  // // {
  // //   rank: {
  // //     min: 0,
  // //     max: 0,
  // //   },
  // //   bonded: {
  // //     min: 0,
  // //     max: 0,
  // //   },
  // // },
  favourites: string[]
  list: IPool[]
  filteredList: IPool[]
  pool: IPool
}
interface IState {
  chain: string
  kusama: IChainState
  polkadot: IChainState
}

const initialState = {
  chain: 'kusama',
  kusama: {
    apiConnected: false,
    updatedAt: null,
    loading: false,
    pagination: {
      page: 1,
      itemsPerPage: 15
    } as IPagination,
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: 'name',
      sortDesc: false
    } as IOptions,
    search: '',
    filter: {
      valid: false,
      active: false
    } as IFilter,
    // ranges: {
    //   rank: {
    //     min: 0,
    //     max: 0
    //   },
    //   bonded: {
    //     min: 0,
    //     max: 0
    //   }
    // } as TRanges,
    favourites: [],
    list: [] as IPool[],
    filteredList: [],
    pool: {} as IPool
  },
  polkadot: {
    apiConnected: false,
    updatedAt: null,
    loading: false,
    pagination: {
      page: 1,
      itemsPerPage: 15
    } as IPagination,
    options: {
      page: 1,
      itemsPerPage: 10,
      sortBy: 'name',
      sortDesc: false
    } as IOptions,
    search: '',
    filter: {
      valid: false,
      active: false
    } as IFilter,
    // ranges: {
    //   rank: {
    //     min: 0,
    //     max: 0
    //   },
    //   bonded: {
    //     min: 0,
    //     max: 0
    //   }
    // } as TRanges,
    favourites: [],
    list: [] as IPool[],
    filteredList: [],
    pool: {} as IPool
  }
} as IState

const STORAGE_KEY = 'metaspan.pool'

function saveState (state: IState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function clearState () {
  console.debug('store/modules/pool.ts: clearState()', STORAGE_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

function getState () {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    console.debug('store/modules/pool.ts: getState(): restoring from localStorage')
    return JSON.parse(savedState)
  } else {
    console.debug('store/modules/pool.ts: getState(): using initialState')
    return initialState
  }
}

/* eslint-disable no-new */
const pool = {
  namespaced: true,
  modules: {},
  state: getState(),
  getters: {
    list (state: IState) {
      console.debug('store/modules/pool.ts: getters.list()', state.chain)
      return state[state.chain].list
    }
  },
  mutations: {
    SET_CHAIN (state: IState, { chain }): void {
      console.debug('store/modules/pool.ts: SET_CHAIN()', chain)
      state.chain = chain
    },
    SET_LOADING (state: IState, loading: boolean): void {
      state[state.chain].loading = loading
    },
    API_STATUS (state, { connected, chain }) {
      // state[chain].apiConnected = connected
      state.apiConnected = connected
    },
    ADD_POOL (state: IState, pool: IPool) {
      console.debug('store/modules/pool.ts: ADD_POOL()', state.chain, pool.id)
      const px = state[state.chain].list.findIndex(f => f.id === pool.id)
      if (px > -1) {
        state[state.chain].list[px] = pool
      } else {
        state[state.chain].list.push(pool)
      }
      saveState(state)
    },
    SET_LIST (state: IState, list: IPool[]): void {
      console.debug('SET_LIST', list)
      state[state.chain].list = list
      state[state.chain].updatedAt = new Date()

      // var ranks = list.map(m => m.rank).sort( (a,b) => {return a-b} )
      // var udata = [...new Set(ranks)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state[state.chain].ranges.rank = {min: Math.min(...udata), max: Math.max(...udata)}
      saveState(state)
    },
    SET_FILTERED_LIST (state: IState, filteredList: IPool[]): void {
      state[state.chain].filteredList = filteredList
      saveState(state)
    },
    SET_POOL (state: IState, model: IPool): void {
      console.debug('store/modules/pool.ts: SET_POOL()', model)
      Vue.set(state, 'pool', model)
      saveState(state)
    },
    SET_PAGINATION (state: IState, pagination: IPagination): void {
      state[state.chain].pagination = pagination
      saveState(state)
    },
    SET_OPTIONS (state: IState, options: IOptions): void {
      state[state.chain].options = options
      saveState(state)
    },
    SET_FILTER (state: IState, filter: IFilter): void {
      state[state.chain].filter = filter
      saveState(state)
    },
    SET_SEARCH (state: IState, search: string): void {
      state[state.chain].search = search
      saveState(state)
    },
    TOGGLE_FAV (state: IState, stash: string): void {
      const idx = state[state.chain].favourites.findIndex((v) => {
        return v === stash
      })
      // console.debug('idx', idx)
      if (idx > -1) {
        state[state.chain].favourites = state[state.chain].favourites.filter((f) => {
          return f !== stash
        })
      } else {
        state[state.chain].favourites.push(stash)
      }
      saveState(state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ dispatch }: any): Promise<void> {
      // await dispatch('getList')
    },
    async setChain ({ commit }, { chain }) {
      await commit('SET_CHAIN', { chain })
    },
    async apiClose ({ dispatch }) {
      await dispatch('apiStatus', { connected: false, chain: 'kusama' })
      await dispatch('apiStatus', { connected: false, chain: 'polkadot' })
    },
    async apiStatus ({ commit }, { connected, chain }) {
      await commit('API_STATUS', { connected, chain })
    },
    // eslint-disable-next-line
    async loading ({ commit }: any, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    async addPool ({ commit }, pool: IPool) {
      // console.debug('store/modules/pool.ts: addPool()', pool)
      await commit('ADD_POOL', pool)
    },
    // async getList ({ commit }) {
    // },
    // eslint-disable-next-line
    async setList ({ commit, dispatch }: any, list: IPool[]) {
      commit('SET_LIST', list)
      dispatch('filterList')
    },
    // eslint-disable-next-line
    async setIds ({ state, commit, dispatch }: any, ids: any[]) {
      const list = state.list.map(m => {
        const id = ids.find(f => f.id === m.id)
        if (id) {
          m.display = id.display
        }
        return m
      })
      commit('SET_LIST', list)
      dispatch('filterList')
    },
    // eslint-disable-next-line
    async filterList ({ commit }: any) {
      const filteredList: IPool[] = []
      commit('SET_FILTERED_LIST', filteredList)
    },
    // eslint-disable-next-line
    async paginate ({ commit }: any, pagination: IPagination) {
      await commit('SET_PAGINATION', pagination)
    },
    // eslint-disable-next-line
    async handleOptions ({ commit }: any, options: any) {
      await commit('SET_OPTIONS', options)
    },
    // eslint-disable-next-line
    async handleFilter ({ commit }: any, filter: IFilter) {
      await commit('SET_FILTER', filter)
    },
    // eslint-disable-next-line
    async setSearch ({ commit }: any, search: string) {
      await commit('SET_SEARCH', search)
    },
    // eslint-disable-next-line
    async setPool ({ state, commit }: any, { id }: any) {
      console.debug('store/modules/pool.ts: setPool()', id)
      const v = state[state.chain].list.find((i: IPool) => {
        return i.id === id
      })
      // if (!v) {
      //   console.debug('not in cache... axios direct')
      //   const res = await axios.get(`//api.metaspan.io/api/pool/${id}`)
      //   if (res?.data.pool) {
      //     v = res.data.pool
      //   }
      // }
      await commit('SET_POOL', v)
    },
    // eslint-disable-next-line
    async toggleFav ({ commit }: any, stash: string) {
      await commit('TOGGLE_FAV', stash)
    },
    async resetCache (): Promise<void> {
      console.debug('store/modules/pool.ts: actions.resetCache()')
      clearState()
    }
  }
}

export default pool
