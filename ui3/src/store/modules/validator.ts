
import { IValidator } from '@/types/global'
import axios from 'axios'

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

interface IMinMax {
  min: number
  max: number
}

type TRanges = Record<string, IMinMax>

interface IState {
  updatedAt: null|Date
  loading: boolean
  pagination: IPagination
  options: IOptions,
  search: string
  filter: IFilter
  ranges: TRanges // Record<string, IMinMax>
  // {
  //   rank: {
  //     min: 0,
  //     max: 0,
  //   },
  //   bonded: {
  //     min: 0,
  //     max: 0,
  //   },
  // },
  favourites: string[]
  list: IValidator[]
  filteredList: IValidator[]
  validator: IValidator
}

/* eslint-disable no-new */
const validator = {
  namespaced: true,
  modules: {
  },
  state: {
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
    ranges: {
      rank: {
        min: 0,
        max: 0
      },
      bonded: {
        min: 0,
        max: 0
      }
    } as TRanges,
    favourites: [],
    list: [],
    filteredList: [],
    validator: {} as IValidator
  } as IState,
  getters: {},
  mutations: {
    SET_LOADING (state: IState, loading: boolean): void {
      state.loading = loading
    },
    SET_LIST (state: IState, list: IValidator[]): void {
      console.debug('SET_LIST', list)
      state.list = list
      state.updatedAt = new Date()

      // var ranks = list.map(m => m.rank).sort( (a,b) => {return a-b} )
      // var udata = [...new Set(ranks)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state.ranges.rank = {min: Math.min(...udata), max: Math.max(...udata)}
    },
    SET_FILTERED_LIST (state: IState, filteredList: IValidator[]): void {
      state.filteredList = filteredList
    },
    SET_VALIDATOR (state: IState, model: IValidator): void {
      state.validator = model
    },
    SET_PAGINATION (state: IState, pagination: IPagination): void {
      state.pagination = pagination
    },
    SET_OPTIONS (state: IState, options: IOptions): void {
      state.options = options
    },
    SET_FILTER (state: IState, filter: IFilter): void {
      state.filter = filter
    },
    SET_SEARCH (state: IState, search: string): void {
      state.search = search
    },
    TOGGLE_FAV (state: IState, stash: string): void {
      const idx = state.favourites.findIndex((v) => {
        return v === stash
      })
      // console.debug('idx', idx)
      if (idx > -1) {
        state.favourites = state.favourites.filter((f) => {
          return f !== stash
        })
      } else {
        state.favourites.push(stash)
      }
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ dispatch }: any): Promise<void> {
      await dispatch('getList')
    },
    // eslint-disable-next-line
    async loading ({ commit }: any, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    // eslint-disable-next-line
    async setList ({ commit, dispatch }: any, list: IValidator[]) {
      commit('SET_LIST', list)
      dispatch('filterList')
    },
    // eslint-disable-next-line
    async filterList ({ commit }: any) {
      const filteredList: IValidator[] = []
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
    async setValidator ({ state, commit }: any, stash: string) {
      let v = state.list.find((i: IValidator) => {
        return i.stash === stash
      })
      if (!v) {
        console.debug('not in cache... axios direct')
        const res = await axios.get(`//api.metaspan.io/api/validator/${stash}`)
        if (res?.data.validator) {
          v = res.data.validator
        }
      }
      await commit('SET_VALIDATOR', v)
    },
    // eslint-disable-next-line
    async toggleFav ({ commit }: any, stash: string) {
      await commit('TOGGLE_FAV', stash)
    }
  }
}

export default validator
