
import {
  ICandidate, ICandidateListFilter,
  ICandidateListSort,
  Candidate,
  ICandidateValidityItem
} from '@/types/global'
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

interface IChainState {
  updatedAt: null | moment.Moment
  list: ICandidate[]
  candidate: ICandidate
  filteredList: ICandidate[]
  loading: boolean
  pagination: IPagination
  sort: ISort
  search: string
  filtering: boolean
  filter: IFilter
  ranges: TRanges
  options: IOption[]
  favourites: string[]
}

interface IState {
  chain: string
  updatedAt: null | moment.Moment
  // list: ICandidate[]
  polkadot: IChainState
  kusama?: IChainState
  // candidate: ICandidate
}

const initialState = {
  chain: 'kusama',
  updatedAt: moment().add(-1, 'day'),
  // list: [],
  polkadot: {
    updatedAt: moment().add(-1, 'day'),
    loading: false,
    filtering: false,
    pagination: {
      page: 1,
      itemsPerPage: 15
    },
    sort: {
      sort: 'totalScore',
      sortAsc: false
    },
    search: '',
    filter: { valid: false, active: false },
    options: {} as IOption[],
    ranges: {
      score: { min: 0, max: 0 },
      rank: { min: 0, max: 0 },
      bonded: { min: 0, max: 0 }
    },
    favourites: ['HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx'],
    list: [],
    filteredList: [],
    candidate: new Candidate({ stash: 'loading', valid: false, validity: [{ valid: false }] as ICandidateValidityItem[] } as ICandidate)
  } as IChainState,
  kusama: {
    updatedAt: moment().add(-1, 'day'),
    loading: false,
    filtering: false,
    pagination: {
      page: 1,
      itemsPerPage: 15
    },
    sort: {
      sort: 'totalScore',
      sortAsc: false
    },
    search: '',
    filter: { valid: false, active: false },
    options: {} as IOption[],
    ranges: {
      score: { min: 0, max: 0 },
      rank: { min: 0, max: 0 },
      bonded: { min: 0, max: 0 }
    },
    favourites: ['HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx'],
    list: [],
    filteredList: [],
    candidate: new Candidate({ stash: 'loading', valid: false, validity: [{ valid: false }] as ICandidateValidityItem[] } as ICandidate)
  } as IChainState
} as IState

const STORAGE_KEY = 'candidate'

function saveState (state: IState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function clearState () {
  console.debug('store/modules/candidate.ts: clearState()', STORAGE_KEY)
  localStorage.removeItem(STORAGE_KEY)
}

function getState () {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    console.debug('store/modules/candidate.ts: getState(): restoring from localStorage')
    return JSON.parse(savedState)
  } else {
    console.debug('store/modules/candidate.ts: getState(): using initialState')
    return initialState
  }
}

interface IMutLoading {
  chain: string
  loading: boolean
}

/* eslint-disable no-new */
const candidate = {
  namespaced: true,
  modules: {
  },
  state: getState(),
  getters: {
    filteredList (state: IState) {
      console.debug('candidate.ts: getters.filteredList()', state.chain)
      return state[state.chain].filteredList
    },
    loading (state: IState) { return state[state.chain].loading },
    updatedAt (state: IState) { return state[state.chain].updatedAt },
    filter (state: IState) { return state[state.chain].filter },
    filtering (state: IState) { return state[state.chain].filtering },
    favourites (state: IState) { return state[state.chain].favourites },
    candidate (state: IState) { return state[state.chain].candidate },
    ranges (state: IState) { return state[state.chain].ranges }
  },
  mutations: {
    // eslint-disable-next-line
    SET_LOADING (state: IState, { chain, loading }: IMutLoading): void {
      console.debug('candidate.ts: mutations.SET_LOADING()', chain, loading)
      state[chain].loading = loading
    },
    // eslint-disable-next-line
    SET_CHAIN (state: IState, chain: string): void {
      console.debug('candidate.ts: mutations.SET_CHAIN()', chain)
      state.chain = chain
      saveState(state)
    },
    // eslint-disable-next-line
    SET_FILTERING (state: IState, { chain, value }: any): void {
      state[chain].filtering = value
      saveState(state)
    },
    // eslint-disable-next-line
    SET_LIST (state: IState, { chain, list }: any): void {
      // console.debug('candidate.ts: mutations.SET_LIST()', chain, list)
      let udata = [] as number[]
      let ranks = [] as number[]
      Vue.set(state[chain], 'list', list.map((m: ICandidate) => new Candidate(m)))
      state[chain].updatedAt = moment()

      ranks = list.map((m) => {
        return m.rank
      }).sort((a, b) => {
        return a - b
      })
      udata = [...new Set(ranks)]
      udata = udata.slice(udata.length * 0.055, udata.length * 0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      state[chain].ranges.rank = { min: Math.min(...udata), max: Math.max(...udata) }

      state[chain].ranges.score = list
        .map((m: ICandidate) => m.score?.total)
        .reduce(function (result: IMinMax, item: number) {
          return item
            ? {
                min: Math.min(result.min, item),
                max: Math.max(result.max, item)
              }
            : result
        }, { min: 50, max: 0 })

      // // TODO work out the selfStake / bonded from the api...
      // var bonds = list.map(m => m.bonded).sort( (a,b) => {return a-b} )
      // udata = [...new Set(bonds)]
      // udata = udata.slice(udata.length*0.055, udata.length*0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      // state.ranges.bonded = {min: Math.min(...udata), max: Math.max(...udata)}
      saveState(state)
    },
    // eslint-disable-next-line
    SET_FILTERED_LIST (state: IState, { chain, flist }: any): void {
      // console.debug('SET_FILTERED_LIST', flist.length)
      // state.filteredList = flist
      Vue.set(state[chain], 'filteredList', flist)
      saveState(state)
    },
    // eslint-disable-next-line
    SET_CANDIDATE (state: IState, { chain, model }: any): void {
      console.debug('SET_CANDIDATE', chain, model)
      state[chain].candidate = model
      saveState(state)
    },
    // eslint-disable-next-line
    SET_PAGINATION (state: IState, { chain, pagination }: any): void {
      console.debug('candidate.ts: SET_PAGINATION', chain, pagination)
      state[chain].pagination = pagination
      saveState(state)
    },
    // eslint-disable-next-line
    SET_OPTIONS (state: IState, { chain, options }: any): void {
      console.debug('candidate.ts: SET_OPTIONS', chain, options)
      state[chain].options = options
      saveState(state)
    },
    // eslint-disable-next-line
    SET_FILTER (state: IState, { chain, filter }: any): void {
      console.debug('store/modules/candidate.ts: SET_FILTER()', state[chain], filter)
      state[chain].filter = filter
      saveState(state)
    },
    // eslint-disable-next-line
    SET_SEARCH (state: IState, { chain, search }: any): void {
      state[chain].search = search
      saveState(state)
    },
    // eslint-disable-next-line
    TOGGLE_FAV (state: IState, { chain, stash }: any): void {
      const idx = state[chain].favourites.findIndex((v:string) => {
        return v === stash
      })
      // console.debug('idx', idx);
      if (idx > -1) {
        state[chain].favourites = state[chain].favourites.filter((f: string) => {
          return f !== stash
        })
      } else {
        state[chain].favourites.push(stash)
      }
      saveState(state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ dispatch }: any, { chain }: any) {
      console.debug('store/modules/candidate.ts: init()', chain)
      if (chain) {
        await dispatch('getList', { chain })
      }
    },
    async setChain ({ commit, dispatch }, chain: string) {
      await commit('SET_CHAIN', chain)
      await dispatch('getList', { chain })
    },
    // eslint-disable-next-line
    async getList ({ state, commit, dispatch }:any, { chain }: any) {
      console.debug('store/modules/candidate.ts: getList()', chain)
      let list = []
      console.debug('candidate/getList', state[chain].updatedAt.toString())
      if (!state[chain]?.updatedAt || moment().diff(moment(state[chain]?.updatedAt), 'seconds') > 60) {
        console.debug('candidate.ts: getList(): reloading list from api', chain)
        try {
          // eslint-disable-next-line
          let res = null as any
          await commit('SET_LOADING', { chain, loading: true })
          // var res = await axios.get(`${baseUrl}/candidates`)
          res = await axios.get(
            // 'https://619wrsnit5.execute-api.eu-west-2.amazonaws.com/default/kusama-1kv-candidates'
            `//api.metaspan.io/api/${chain}/candidate`
          )
          console.debug('HHHHHHHHH candidates.ts: got data:', res.data)
          list = res.data.candidates
          if (list) {
            await commit('SET_LIST', { chain, list })
          } else {
            console.debug('there is no data')
            console.debug(res)
          }
          // console.debug("committed")
        } catch (err) {
          await commit('SET_LOADING', { chain, loading: false })
          console.debug('OOPS, caught an error')
          console.error(err)
        } finally {
          await commit('SET_LOADING', { chain, loading: false })
        }
        await dispatch('filterList', { chain })
      } else {
        dispatch('addAlert', { id: moment().valueOf(), type: 'warning', title: 'Cache age < 60 seconds', text: 'Serving from local cache' }, { root: true })
        console.log(`age of cache: ${moment().diff(moment(state[chain].updatedAt), 'seconds')} seconds`)
      }
    },
    // eslint-disable-next-line
    async paginate ({ commit }: any, { chain, pagination }: any) {
      console.debug('store/modules/candidate.ts: paginate()', chain, pagination)
      await commit('SET_PAGINATION', { chain, pagination })
    },
    // eslint-disable-next-line
    async handleOptions ({ commit, dispatch }: any, { chain, options }: any) {
      await commit('SET_OPTIONS', { chain, options })
      await dispatch('filterList', { chain })
    },
    // eslint-disable-next-line
    async handleFilter ({ commit, dispatch }: any, { chain, filter }: any) {
      console.debug('candidate.ts: actions.handleFilter()', { chain, filter })
      await commit('SET_FILTER', { chain, filter })
      await dispatch('filterList', { chain })
    },
    // eslint-disable-next-line
    async setSearch ({ commit, dispatch }: any, { chain, search }: any) {
      await commit('SET_SEARCH', { chain, search })
      await dispatch('filterList', { chain })
    },
    // eslint-disable-next-line
    async filterList ({ state, commit }: any, { chain }: any) {
      console.debug('filterList()', chain)
      commit('SET_FILTERING', { chain, value: true })
      const filter: ICandidateListFilter = state[chain].filter
      const sort: ICandidateListSort = state[chain].sort
      const search: string = state[chain].search
      const favourites: string[] = state[chain].favourites
      // console.debug('filter, sort, search', filter, sort, search)
      const flist = state[chain].list.filter((item: ICandidate) => {
        if ((filter.favourite && !favourites.includes(item.stash)) ||
          (filter.valid && !item.valid) ||
          (filter.active && !item.active) ||
          (filter.rank && !(item.rank > filter.rank)) ||
          (filter.score && !(item.score.total > filter.score))
        ) {
          // console.debug('filter', filter.valid, 'item', item.valid)
          return false
        } else if (search !== '' && !(
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.identity?.name.toLowerCase().includes(search.toLowerCase()) ||
          // {{ candidate.identity ? candidate.identity.name : '' }}
          item.stash.includes(search)
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
            ? (a[sortField] as number) - (b[sortField] as number)
            : (b[sortField] as number) - (a[sortField] as number)
        }
      })
      commit('SET_FILTERED_LIST', { chain, flist })
      commit('SET_FILTERING', { chain, value: false })
    },
    // eslint-disable-next-line
    async setCandidate ({ state, commit }: any, { chain, stash }: any) {
      console.debug('store/modules/candidate.ts: setCandidate()', chain, stash)
      let v = state[chain].list.find((i: ICandidate) => i.stash === stash)
      if (!v) {
        console.debug('not in cache... axios direct')
        await commit('SET_LOADING', { chain, loading: true })
        const res = await axios.get(`//api.metaspan.io/api/kusama/candidate/${stash}`)
        if (res?.data.candidate) {
          v = res.data.candidate
        }
        await commit('SET_LOADING', { chain, loading: false })
      }
      await commit('SET_CANDIDATE', { chain, model: v })
      // await dispatch('polkadot/get', stash, {root:true})
    },
    // eslint-disable-next-line
    async setLoading ({ commit }: any, { chain, value}: any) {
      await commit('SET_LOADING', { chain, loading: value })
    },
    // eslint-disable-next-line
    async toggleFav ({ commit }: any, { chain, stash}: any) {
      // console.debug('toggleFav()', stash)
      await commit('TOGGLE_FAV', { chain, stash })
    },
    async resetCache (): Promise<void> {
      console.debug('store/modules/candidate.ts: actions.resetCache()')
      clearState()
    }
  }
}

export default candidate
