
import Vue from 'vue'
import {
  ICandidate, ICandidateListFilter,
  ICandidateListSort,
  Candidate,
  ICandidateValidityItem
} from '@/types/global'
import axios from 'axios'
import moment from 'moment-timezone'
import { IndexedDB } from './idb'

const idb = new IndexedDB('candidates')

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
  // initial: boolean // has the chain been initialised?
  apiConnected: boolean
  updatedAt: string // null | moment.Moment
  chainInfo: any
  list: ICandidate[]
  candidate: ICandidate
  filteredList: ICandidate[]
  loading: boolean
  // eslint-disable-next-line
  loadingTimeout: any
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
  initial: boolean // has the module been initialised
  chain: string
  // updatedAt: null | moment.Moment
  // list: ICandidate[]
  polkadot: IChainState
  kusama?: IChainState
  // candidate: ICandidate
}

const initialState = {
  initial: true,
  chain: 'kusama',
  // updatedAt: moment().add(-1, 'day'),
  // list: [],
  polkadot: {
    apiConnected: false,
    updatedAt: moment().add(-1, 'day').utc().format(),
    chainInfo: {},
    loading: false,
    loadingTimeout: null,
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
    favourites: ['16ce9zrmiuAtdi9qv1tuiQ1RC1xR6y6NgnBcRtMoQeAobqpZ'],
    list: [],
    filteredList: [],
    candidate: new Candidate({ stash: 'loading', valid: false, validity: [{ valid: false }] as ICandidateValidityItem[] } as ICandidate)
  } as IChainState,
  kusama: {
    apiConnected: false,
    updatedAt: moment().add(-1, 'day').utc().format(),
    chainInfo: {},
    loading: false,
    loadingTimeout: null,
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

async function saveState (state: IState) {
  console.debug('store/modules/candidate.ts: saveState()', state)
  // localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  // remove api from saved state
  if (!state.initial) await idb.set(STORAGE_KEY, state)
}

async function clearState () {
  console.debug('store/modules/candidate.ts: clearState()', STORAGE_KEY)
  // localStorage.removeItem(STORAGE_KEY)
  await idb.unset(STORAGE_KEY)
}

function getState (state: IState): any {
  console.debug('store/modules/candidate.ts: getState()', state)
  // const savedState = localStorage.getItem(STORAGE_KEY)
  idb.get(STORAGE_KEY).then((savedState) => {
    if (savedState) {
      console.debug('store/modules/candidate.ts: getState(): restoring from idb()')
      // return JSON.parse(savedState)
      // console.debug(savedState)
      const mergedState = { ...savedState, ...state }
      console.debug(mergedState)
      return mergedState
    } else {
      console.debug('store/modules/candidate.ts: getState(): using initialState')
      initialState.initial = false
      const mergedState = { ...initialState, ...state }
      console.debug(initialState, state, mergedState)
      return mergedState
    }
  })
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
  // state: getState(initialState),
  state: initialState,
  getters: {
    apiConnected (state: IState) { return state[state.chain]?.apiConnected },
    chainInfo (state: IState) { return state[state.chain].chainInfo },
    candidate (state: IState) { return state[state.chain]?.candidate },
    filteredList (state: IState) {
      console.debug('candidate.ts: getters.filteredList()', state.chain)
      return state[state.chain].filteredList
    },
    favourites (state: IState) { return state[state.chain]?.favourites },
    filter (state: IState) { return state[state.chain]?.filter },
    filtering (state: IState) { return state[state.chain]?.filtering },
    loading (state: IState) { return state[state.chain]?.loading },
    options (state: IState) { return state[state.chain]?.options },
    ranges (state: IState) { return state[state.chain]?.ranges },
    updatedAt (state: IState) { return moment(state[state.chain]?.updatedAt) }
  },
  mutations: {
    async INIT (state: IState, value: any) {
      console.debug('store/modules/candidate.ts: mutations.INIT()', state, value)
      state = { ...value }
      await saveState(state)
    },
    // eslint-disable-next-line
    SET_LOADING (state: IState, { loading }: IMutLoading): void {
      console.debug('store/modules/candidate.ts: mutations.SET_LOADING()', state.chain, loading)
      state[state.chain].loading = loading
      // state[state.chain].loadingTimeout = setTimeout(() => {
      //   clearTimeout(state[state.chain].loadingTimeout)
      // }, 10 * 1000)
    },
    SET_INITIAL (state, initial) {
      console.debug('store/modules/candidate.ts: mutations.SET_INITIAL()', initial)
      state.initial = initial
    },
    // eslint-disable-next-line
    async SET_CHAIN (state: IState, { chain }: any): Promise<void> {
      console.debug('store/modules/candidate.ts: mutations.SET_CHAIN()', chain)
      // console.debug('window.$polkadot', window.$polkadot)
      state.chain = chain
      await saveState(state)
    },
    API_STATUS (state, { connected, chain }) {
      state[chain].apiConnected = connected
    },
    // eslint-disable-next-line
    async SET_FILTERING (state: IState, { value }: any): Promise<void> {
      state[state.chain].filtering = value
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_LIST (state: IState, { list }: any): Promise<void> {
      // console.debug('candidate.ts: mutations.SET_LIST()', chain, list)
      let udata = [] as number[]
      let ranks = [] as number[]
      Vue.set(state[state.chain], 'list', list.map((m: ICandidate) => new Candidate(m)))
      state[state.chain].updatedAt = moment().utc().format()

      ranks = list.map((m) => {
        return m.rank
      }).sort((a, b) => {
        return a - b
      })
      udata = [...new Set(ranks)]
      udata = udata.slice(udata.length * 0.055, udata.length * 0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      state[state.chain].ranges.rank = { min: Math.min(...udata), max: Math.max(...udata) }

      state[state.chain].ranges.score = list
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
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_FILTERED_LIST (state: IState, { flist }: any): Promise<void> {
      // console.debug('SET_FILTERED_LIST', flist.length)
      // state.filteredList = flist
      Vue.set(state[state.chain], 'filteredList', flist)
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_CANDIDATE (state: IState, { model }: any): Promise<void> {
      console.debug('SET_CANDIDATE', model)
      state[state.chain].candidate = model
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_PAGINATION (state: IState, { pagination }: any): Promise<void> {
      // console.debug('candidate.ts: SET_PAGINATION', state.chain, pagination)
      state[state.chain].pagination = pagination
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_OPTIONS (state: IState, { options }: any): Promise<void> {
      // console.debug('candidate.ts: SET_OPTIONS', state.chain, options)
      state[state.chain].options = options
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_FILTER (state: IState, { filter }: any): Promise<void> {
      console.debug('store/modules/candidate.ts: SET_FILTER()', state.chain, filter)
      // state[state.chain].filter = filter
      Object.assign(state[state.chain], filter)
      await saveState(state)
    },
    // eslint-disable-next-line
    async SET_SEARCH (state: IState, { search }: any): Promise<void> {
      state[state.chain].search = search
      await saveState(state)
    },
    // eslint-disable-next-line
    async TOGGLE_FAV (state: IState, { stash }: any): Promise<void> {
      const idx = state[state.chain].favourites.findIndex((v:string) => {
        return v === stash
      })
      // console.debug('idx', idx);
      if (idx > -1) {
        state[state.chain].favourites = state[state.chain].favourites.filter((f: string) => {
          return f !== stash
        })
      } else {
        state[state.chain].favourites.push(stash)
      }
      await saveState(state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ commit, dispatch, state, rootState }: any) {
      console.debug('store/modules/candidate.ts: init()', rootState.chain) // , state)
      // const sstate = await getState(state)
      // await commit('INIT', sstate)
      // if (chain) {
      await dispatch('setChain', { chain: rootState.chain })
      //   // await dispatch('getList')
      // } else {
      //   console.debug('candidate.ts: there is no chain...', rootState.substrate.chain)
      //   console.table(rootState.substrate.chain)
      // }
      await commit('SET_INITIAL', false)
    },
    async setChain ({ commit, dispatch }, { chain }) {
      console.debug('store/modules/candidate.ts: setChain()', chain)
      await commit('SET_CHAIN', { chain })
      await dispatch('getList')
    },
    async apiClose ({ dispatch }) {
      // commit('')
      await dispatch('apiStatus', { connected: false, chain: 'kusama' })
      await dispatch('apiStatus', { connected: false, chain: 'polkadot' })
    },
    async apiStatus ({ commit }, { connected, chain }) {
      await commit('API_STATUS', { connected, chain })
    },
    // eslint-disable-next-line
    async getList ({ rootState, state, commit, dispatch }: any) {
      console.debug('store/modules/candidate.ts: getList()', state.chain, 'initial:', state.initial)
      let list = []
      // console.debug('store/modules/candidate.ts: getList(): updatedAt', state[state.chain].updatedAt.toString())
      if (!state[state.chain]?.updatedAt || moment().diff(moment(state[state.chain]?.updatedAt), 'seconds') > 60) {
        console.debug('store/modules/candidate.ts: getList(): reloading list from api', state.chain)
        try {
          // eslint-disable-next-line
          let res = null as any
          await commit('SET_LOADING', { loading: true })
          // var res = await axios.get(`${baseUrl}/candidates`)
          res = await axios.get(
            // 'https://619wrsnit5.execute-api.eu-west-2.amazonaws.com/default/kusama-1kv-candidates'
            // `//api.metaspan.io/api/${state.chain}/candidate`
            `${rootState.baseUrl}/api/${state.chain}/candidate`
          )
          // console.debug('HHHHHHHHH candidates.ts: got data:', res.data)
          list = res.data?.candidates ? res.data.candidates : res.data
          if (list) {
            await commit('SET_LIST', { list })
          } else {
            console.debug('there is no data')
            console.debug(res)
          }
          // console.debug("committed")
        } catch (err) {
          await commit('SET_LOADING', { loading: false })
          console.debug('OOPS, caught an error')
          console.error(err)
        } finally {
          await commit('SET_LOADING', { loading: false })
        }
        await dispatch('filterList')
      } else {
        dispatch('addAlert', { id: moment().valueOf(), type: 'warning', title: 'Cache age < 60 seconds', text: 'Serving from local cache' }, { root: true })
        console.log(`age of cache: ${moment().diff(moment(state[state.chain].updatedAt), 'seconds')} seconds`)
      }
    },
    // eslint-disable-next-line
    async paginate ({ commit }: any, { pagination }: any) {
      console.debug('store/modules/candidate.ts: paginate()', pagination)
      await commit('SET_PAGINATION', { pagination })
    },
    // eslint-disable-next-line
    async handleOptions ({ commit, dispatch }: any, { options }: any) {
      await commit('SET_OPTIONS', { options })
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async handleFilter ({ commit, dispatch }: any, { filter }: any) {
      console.debug('store/modules/candidate.ts: actions.handleFilter()', { filter })
      await commit('SET_FILTER', { filter })
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async setSearch ({ commit, dispatch }: any, { search }: any) {
      await commit('SET_SEARCH', { search })
      await dispatch('filterList')
    },
    // eslint-disable-next-line
    async filterList ({ state, commit }: any) {
      console.debug('store/modules/candidate.ts: filterList()')
      commit('SET_FILTERING', { value: true })
      const filter: ICandidateListFilter = state[state.chain].filter
      const sort: ICandidateListSort = state[state.chain].sort
      const search: string = state[state.chain].search
      const favourites: string[] = state[state.chain].favourites
      console.debug('store/modules/candidate.ts: filter, sort, search', filter, sort, search)
      const flist = state[state.chain].list.filter((item: ICandidate, idx: number) => {
        // console.debug('item', idx, item)
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
          item.identity?.name?.toLowerCase().includes(search.toLowerCase()) ||
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
      commit('SET_FILTERED_LIST', { flist })
      commit('SET_FILTERING', { value: false })
    },
    // eslint-disable-next-line
    async setCandidate ({ rootState, state, commit }: any, { chain, stash }: any) {
      console.debug('store/modules/candidate.ts: setCandidate()', chain, stash)
      let v = state[chain].list.find((i: ICandidate) => i.stash === stash)
      if (!v) {
        console.debug('not in cache... axios direct')
        await commit('SET_LOADING', { chain, loading: true })
        // const res = await axios.get(`//api.metaspan.io/api/kusama/candidate/${stash}`)
        const res = await axios.get(`${rootState.baseUrl}/api/${state.chain}/candidate`)
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
      console.debug('store/modules/candidate.ts: actions.setLoading()', value)
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
