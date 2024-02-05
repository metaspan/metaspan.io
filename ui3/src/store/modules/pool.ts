
import { IPool } from '@/types/global'
import { StateManager } from '../state-manager'
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
  favourites: string[]
  list: IPool[]
  filteredList: IPool[]
  pool: IPool
}
interface IState {
  initial: boolean
  chainId: string
  chains: Record<string, IChainState>
}

const initialState = {
  initial: true,
  chainId: 'kusama',
  chains: {
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
      favourites: [],
      list: [] as IPool[],
      filteredList: [],
      pool: { points: 0 } as IPool
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
      favourites: [],
      list: [] as IPool[],
      filteredList: [],
      pool: { points: 0 } as IPool
    }
  }
} as IState

const pool = {
  namespaced: true,
  modules: {},
  state: stateManager.getStateSync(STORAGE_KEY, initialState),
  getters: {
    list (state: IState) {
      console.debug('store/modules/pool.ts: getters.list()', state.chainId)
      return state.chains[state.chainId].list
    },
    pool (state: IState) {
      console.debug('store/modules/pool.ts: getters.pool()', state.chainId)
      return state.chains[state.chainId].pool
    }
  },
  mutations: {
    async INIT(state: IState) {
      state.initial = false
    },
    async SET_CHAIN_ID (state: IState, chainId: string): Promise<void> {
      console.debug('store/modules/pool.ts: SET_CHAIN_ID()', chainId)
      state.chainId = chainId
      if (!state.initial) await stateManager.saveState(STORAGE_KEY, state)
    },
    SET_LOADING (state: IState, loading: boolean): void {
      state.chains[state.chainId].loading = loading
    },
    API_STATUS (state: IState, { connected, chainId }: any) {
      // state[chainId].apiConnected = connected
      state.chains[chainId].apiConnected = connected
    },
    async ADD_POOL (state: IState, pool: IPool) {
      console.debug('store/modules/pool.ts: ADD_POOL()', state.chainId, pool.id)
      const px = state.chains[state.chainId].list.findIndex(f => f.id === pool.id)
      if (px > -1) {
        state.chains[state.chainId].list[px] = pool
      } else {
        state.chains[state.chainId].list.push(pool)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_LIST (state: IState, list: IPool[]) {
      console.debug('SET_LIST', list)
      state.chains[state.chainId].list = list
      state.chains[state.chainId].updatedAt = new Date()
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_FILTERED_LIST (state: IState, filteredList: IPool[]) {
      state.chains[state.chainId].filteredList = filteredList
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_POOL (state: IState, model: IPool) {
      console.debug('store/modules/pool.ts: SET_POOL()', model)
      state.chains[state.chainId].pool = model
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_PAGINATION (state: IState, pagination: IPagination) {
      state.chains[state.chainId].pagination = pagination
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_OPTIONS (state: IState, options: IOptions) {
      state.chains[state.chainId].options = options
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_FILTER (state: IState, filter: IFilter) {
      state.chains[state.chainId].filter = filter
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_SEARCH (state: IState, search: string) {
      state.chains[state.chainId].search = search
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async TOGGLE_FAV (state: IState, stash: string) {
      const idx = state.chains[state.chainId].favourites.findIndex((v) => {
        return v === stash
      })
      if (idx > -1) {
        state.chains[state.chainId].favourites = state.chains[state.chainId].favourites.filter((f) => {
          return f !== stash
        })
      } else {
        state.chains[state.chainId].favourites.push(stash)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ commit }: any): Promise<void> {
      // await dispatch('getList')
      commit('INIT')
    },
    async setChainId ({ commit }: any, chainId: string) {
      await commit('SET_CHAIN_ID', chainId)
    },
    async apiClose ({ dispatch }: any) {
      await dispatch('apiStatus', { connected: false, chainId: 'kusama' })
      await dispatch('apiStatus', { connected: false, chainId: 'polkadot' })
    },
    async apiStatus ({ commit }: any, { connected, chainId }: any) {
      await commit('API_STATUS', { connected, chainId })
    },
    async loading ({ commit }: any, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    async addPool ({ commit }: any, pool: IPool) {
      // console.debug('store/modules/pool.ts: addPool()', pool)
      await commit('ADD_POOL', pool)
    },
    async setList ({ commit, dispatch }: any, list: IPool[]) {
      console.debug('pool.ts: action.setList()', list)
      await commit('SET_LIST', list)
      await dispatch('filterList')
    },
    async setIds ({ state, commit, dispatch }: any, ids: any[]) {
      const list = state.list.map((m: any) => {
        const id = ids.find(f => f.id === m.id)
        if (id) {
          m.display = id.display
        }
        return m
      })
      commit('SET_LIST', list)
      dispatch('filterList')
    },
    async filterList ({ commit }: any) {
      const filteredList: IPool[] = []
      await commit('SET_FILTERED_LIST', filteredList)
    },
    async paginate ({ commit }: any, pagination: IPagination) {
      await commit('SET_PAGINATION', pagination)
    },
    async handleOptions ({ commit }: any, options: any) {
      await commit('SET_OPTIONS', options)
    },
    async handleFilter ({ commit }: any, filter: IFilter) {
      await commit('SET_FILTER', filter)
    },
    async setSearch ({ commit }: any, search: string) {
      await commit('SET_SEARCH', search)
    },
    async setPool ({ state, commit }: any, { id }: any) {
      console.debug('store/modules/pool.ts: setPool()', id)
      const v = state.chains[state.chainId].list.find((i: IPool) => {
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
