
import Vue from 'vue'
import { IPool } from '@/types/global'
// import axios from 'axios'
// import { stat } from 'fs'
// import { SubstrateAPI } from '../../plugins/substrate'
import { StateManager } from '../state-manager'
// import test from 'node:test'
const stateManager = new StateManager('metaspan.io')
const STORAGE_KEY = 'pool'

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
  initial: boolean
  chainId: string
  kusama: IChainState
  polkadot: IChainState
}

const initialState = {
  initial: true,
  chainId: 'kusama',
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

// TODO what is this used for?
async function initState () {
  return await stateManager.getState(STORAGE_KEY, initialState)
}

// function saveState (state: IState) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
// }

// function clearState () {
//   console.debug('store/modules/pool.ts: clearState()', STORAGE_KEY)
//   localStorage.removeItem(STORAGE_KEY)
// }

// function getState () {
//   const savedState = localStorage.getItem(STORAGE_KEY)
//   if (savedState) {
//     console.debug('store/modules/pool.ts: getState(): restoring from localStorage')
//     return JSON.parse(savedState)
//   } else {
//     console.debug('store/modules/pool.ts: getState(): using initialState')
//     return initialState
//   }
// }

/* eslint-disable no-new */
const pool = {
  namespaced: true,
  modules: {},
  state: stateManager.getStateSync(STORAGE_KEY, initialState), // .then(s => s),
  getters: {
    list (state: IState) {
      console.debug('store/modules/pool.ts: getters.list()', state.chainId)
      return state[state.chainId].list
    }
  },
  mutations: {
    async SET_CHAIN_ID (state: IState, chainId: string): Promise<void> {
      console.debug('store/modules/pool.ts: SET_CHAIN_ID()', chainId)
      state.chainId = chainId
      if (!state.initial) await stateManager.saveState(STORAGE_KEY, state)
    },
    SET_LOADING (state: IState, loading: boolean): void {
      state[state.chainId].loading = loading
    },
    API_STATUS (state, { connected, chainId }) {
      // state[chainId].apiConnected = connected
      state.apiConnected = connected
    },
    async ADD_POOL (state: IState, pool: IPool) {
      console.debug('store/modules/pool.ts: ADD_POOL()', state.chainId, pool.id)
      const px = state[state.chainId].list.findIndex(f => f.id === pool.id)
      if (px > -1) {
        state[state.chainId].list[px] = pool
      } else {
        state[state.chainId].list.push(pool)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_LIST (state: IState, list: IPool[]) {
      console.debug('SET_LIST', list)
      state[state.chainId].list = list
      state[state.chainId].updatedAt = new Date()

      // var ranks = list.map(m => m.rank).sort( (a,b) => {return a-b} )
      // var udata = [...new Set(ranks)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state[state.chainId].ranges.rank = {min: Math.min(...udata), max: Math.max(...udata)}
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_FILTERED_LIST (state: IState, filteredList: IPool[]) {
      state[state.chainId].filteredList = filteredList
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_POOL (state: IState, model: IPool) {
      console.debug('store/modules/pool.ts: SET_POOL()', model)
      Vue.set(state, 'pool', model)
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_PAGINATION (state: IState, pagination: IPagination) {
      state[state.chainId].pagination = pagination
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_OPTIONS (state: IState, options: IOptions) {
      state[state.chainId].options = options
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_FILTER (state: IState, filter: IFilter) {
      state[state.chainId].filter = filter
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_SEARCH (state: IState, search: string) {
      state[state.chainId].search = search
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async TOGGLE_FAV (state: IState, stash: string) {
      const idx = state[state.chainId].favourites.findIndex((v) => {
        return v === stash
      })
      // console.debug('idx', idx)
      if (idx > -1) {
        state[state.chainId].favourites = state[state.chainId].favourites.filter((f) => {
          return f !== stash
        })
      } else {
        state[state.chainId].favourites.push(stash)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ dispatch }: any): Promise<void> {
      // await dispatch('getList')
    },
    async setChainId ({ commit }, chainId: string) {
      await commit('SET_CHAIN_ID', chainId)
    },
    async apiClose ({ dispatch }) {
      await dispatch('apiStatus', { connected: false, chainId: 'kusama' })
      await dispatch('apiStatus', { connected: false, chainId: 'polkadot' })
    },
    async apiStatus ({ commit }, { connected, chainId }) {
      await commit('API_STATUS', { connected, chainId })
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
      await commit('SET_LIST', list)
      await dispatch('filterList')
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
      await commit('SET_FILTERED_LIST', filteredList)
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
      const v = state[state.chainId].list.find((i: IPool) => {
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
      // clearState()
      await stateManager.clearState(STORAGE_KEY)
    }
  }
}

export default pool
