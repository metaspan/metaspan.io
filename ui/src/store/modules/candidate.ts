
import { ICandidate, ICandidateListFilter, ICandidateListSort } from '@/types/global'
import axios from 'axios'
import moment from 'moment-timezone'
import Vue from 'vue'

interface IPagination {
  page: number
  itemsPerPage: number
}

interface ISort {
  sort: string
  sortAsc: boolean
}

interface IFilter {
  valid: boolean
  active: boolean
}

// eslint-disable-next-line
interface IOption {}

interface IMinMax {
  min: number
  max: number
}

type TRanges = Record<string, IMinMax>

interface IState {
  updatedAt: null | Date
  loading: boolean
  pagination: IPagination
  sort: ISort
  search: string
  filter: IFilter
  ranges: TRanges
  options: IOption[]
  favourites: string[]
  list: ICandidate[]
  candidate: ICandidate
}

/* eslint-disable no-new */
const candidate = {
  namespaced: true,
  modules: {
  },
  state: {
    updatedAt: null, // moment().add(-1, 'day'),
    loading: false,
    pagination: {
      page: 1,
      itemsPerPage: 15
    },
    sort: {
      sort: 'totalScore',
      sortAsc: false
    },
    search: '',
    filter: {
      valid: false,
      active: false
    },
    ranges: {
      score: {
        min: 0,
        max: 0
      },
      rank: {
        min: 0,
        max: 0
      },
      bonded: {
        min: 0,
        max: 0
      }
    },
    favourites: ['HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx'],
    list: [],
    candidate: {}
  },
  getters: {
    // filteredList (state: IState): ICandidate[] {
    //   return state.list.filteredList
    // }
  },
  mutations: {
    SET_LOADING (state: IState, loading: boolean): void {
      state.loading = loading
    },
    SET_LIST (state: IState, list: ICandidate[]): void {
      // console.debug("SET_LIST", list)
      let udata = []
      let ranks = []
      Vue.set(state, 'list', list)
      state.updatedAt = new Date()

      ranks = list.map((m) => {
        return m.rank
      }).sort((a, b) => {
        return a - b
      })
      udata = [...new Set(ranks)]
      udata = udata.slice(udata.length * 0.055, udata.length * 0.854)
      console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      state.ranges.rank = { min: Math.min(...udata), max: Math.max(...udata) }

      state.ranges.score = list
        .map((m: ICandidate) => m.score?.total)
        .reduce(function (result: IMinMax, item: number) {
          return item ? {
            min: Math.min(result.min, item),
            max: Math.max(result.max, item)
          } : result
        }, { min: 50, max: 0 })

      // // TODO work out the selfStake / bonded from the api...
      // var bonds = list.map(m => m.bonded).sort( (a,b) => {return a-b} )
      // udata = [...new Set(bonds)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state.ranges.bonded = {min: Math.min(...udata), max: Math.max(...udata)}
    },
    SET_FILTERED_LIST (state: IState, flist: ICandidate[]): void {
      console.debug('SET_FILTERED_LIST', flist.length)
      // state.filteredList = flist
      Vue.set(state, 'filteredList', flist)
    },
    SET_CANDIDATE (state: IState, model: ICandidate): void {
      state.candidate = model
    },
    SET_PAGINATION (state: IState, pagination: IPagination): void {
      state.pagination = pagination
    },
    SET_OPTIONS (state: IState, options: IOption[]): void {
      state.options = options
    },
    SET_FILTER (state: IState, filter: IFilter): void {
      state.filter = filter
    },
    SET_SEARCH (state: IState, search: string): void {
      state.search = search
    },
    TOGGLE_FAV (state: IState, stash: string): void {
      const idx = state.favourites.findIndex((v:string) => {
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
    // eslint-disable-next-line
    async init ({ dispatch }: any) {
      // console.debug('candidate/init');
      await dispatch('getList')
    },
    // eslint-disable-next-line
    async getList ({ state, commit, dispatch }:any) {
      let list = []
      // console.debug('candidate/getList', state.updatedAt);
      if (!state.updatedAt || moment().diff(moment(state.updatedAt), 'seconds') > 60) {
        // console.debug('here I am')
        try {
          let res = null
          await commit('SET_LOADING', true)
          // var res = await axios.get(`${baseUrl}/candidates`)
          res = await axios.get(
            'https://619wrsnit5.execute-api.eu-west-2.amazonaws.com/default/kusama-1kv-candidates')
          // console.debug(res.data)
          list = res.data
          if (list) {
            await commit('SET_LIST', list)
          }
          // console.debug("committed")
        } catch (err) {
          await commit('SET_LOADING', false)
          console.debug('OOPS, caught an error')
          console.error(err)
        } finally {
          await commit('SET_LOADING', false)
          // console.debug('... test ...', list.length)
          // for(var i=0; i < list.length; i++) {
          //     console.debug('sending', list[i].stash)
          //     await dispatch('polkadot/get', list[i].stash, {root: true})
          // }
        }
        await dispatch('filterList')
      } else {
        console.log(`age of cache: ${moment().diff(moment(state.updatedAt), 'seconds')} seconds`)
      }
    },
    // eslint-disable-next-line
    async paginate ({ commit }: any, pagination: any) {
      await commit('SET_PAGINATION', pagination)
    },
    // eslint-disable-next-line
    async handleOptions ({ commit, dispatch }: any, options: any) {
      await commit('SET_OPTIONS', options)
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async handleFilter ({ commit, dispatch }: any, filter: any) {
      await commit('SET_FILTER', filter)
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async setSearch ({ commit, dispatch }: any, search: any) {
      await commit('SET_SEARCH', search)
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async filterList ({ state, commit }: any) {
      const filter: ICandidateListFilter = state.filter
      const sort: ICandidateListSort = state.sort
      const search: string = state.search
      console.debug('filter, sort, search', filter, sort, search)
      // const isValid = (items: ICandidateValidityItem[]) => items.find((i: ICandidateValidityItem) => i.valid === false)
      const flist = state.list.filter((item: ICandidate) => {
        if ((filter.favourite && !state.favourites.includes(item.stash)) ||
          (filter.valid && !item.valid) ||
          (filter.active && !item.active) ||
          (filter.rank && !(item.rank > filter.rank)) ||
          (filter.score && !(item.score.total > filter.score))
        ) {
          return false
        } else if (search !== '' && !(
          item.name.toLowerCase().includes(search.toLowerCase()) || item.stash.includes(search)
        )) {
          // console.debug('test:', item.stash, search, item.stash.includes(search))
          return false
        } else {
          // console.debug('test:', item.stash, 'ok!')
          return true
        }
      }).sort((a: ICandidate, b:ICandidate): number => {
        const sortField = sort.sort as keyof ICandidate
        const sortAsc: boolean = sort.sortAsc
        if (sortField === 'name') {
          // console.debug('sort:', a.name, b.name)
          return sortAsc
            ? String(a.name).localeCompare(b.name)
            : String(b.name).localeCompare(a.name)
        } else {
          return sortAsc
            ? a[sortField] - b[sortField]
            : b[sortField] - a[sortField]
        }
      })
      commit('SET_FILTERED_LIST', flist)
    },
    // eslint-disable-next-line
    async setCandidate ({ state, commit }: any, stash: string) {
      const v = state.list.find((i: ICandidate) => {
        return i.stash === stash
      })
      await commit('SET_CANDIDATE', v)
      // await dispatch('polkadot/get', stash, {root:true})
    },
    // eslint-disable-next-line
    async toggleFav ({ commit }: any, stash: string) {
      console.debug('toggleFav()', stash)
      await commit('TOGGLE_FAV', stash)
    }
  }
}

export default candidate
