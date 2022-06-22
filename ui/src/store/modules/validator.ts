
// import moment from 'moment-timezone'

import { ICandidate, IValidator } from '@/types/global'

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

interface IState {
  updatedAt: null|Date
  loading: boolean
  pagination: IPagination
  options: IOptions,
  search: string
  filter: IFilter
  ranges: Record<string, any>
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
const candidate = {
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
    } as any,
    favourites: [],
    list: [],
    filteredList: [],
    validator: {} as IValidator
  } as IState,
  getters: {},
  mutations: {
    SET_LOADING (state: IState, loading: boolean) {
      state.loading = loading
    },
    SET_LIST (state: IState, list: IValidator[]) {
      console.debug('SET_LIST', list)
      state.list = list
      state.updatedAt = new Date()

      // var ranks = list.map(m => m.rank).sort( (a,b) => {return a-b} )
      // var udata = [...new Set(ranks)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state.ranges.rank = {min: Math.min(...udata), max: Math.max(...udata)}
    },
    SET_FILTERED_LIST (state: IState, filteredList: IValidator[]) {
      state.filteredList = filteredList
    },
    SET_VALIDATOR (state: IState, model: IValidator) {
      state.validator = model
    },
    SET_PAGINATION (state: IState, pagination: IPagination) {
      state.pagination = pagination
    },
    SET_OPTIONS (state: IState, options: any) {
      state.options = options
    },
    SET_FILTER (state: IState, filter: IFilter) {
      state.filter = filter
    },
    SET_SEARCH (state: IState, search: string) {
      state.search = search
    },
    TOGGLE_FAV (state: IState, stash: string) {
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
    async init ({ dispatch }: any): Promise<void> {
      await dispatch('getList')
    },
    async loading ({ commit }: any, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    async setList ({ commit, dispatch }: any, list: IValidator[]) {
      commit('SET_LIST', list)
      dispatch('filterList')
    },
    async filterList ({ commit }: any) {
      const filteredList: IValidator[] = []
      commit('SET_FILTERED_LIST', filteredList)
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
    async setValidator ({ state, commit }: any, stash: string) {
      const v = state.list.find((i: IValidator) => {
        return i.stash === stash
      })
      await commit('SET_VALIDATOR', v)
    },
    async toggleFav ({ commit }: any, stash: string) {
      await commit('TOGGLE_FAV', stash)
    }
  }
}

export default candidate
