
import Vue from 'vue'
import {
  ICandidate,
  ICandidateListFilter,
  ICandidateListSort,
  Candidate,
  ICandidateValidityItem
} from '@/types/global'
import axios from 'axios'
// import {apolloClient} from '../../graphql/apollo'
import moment from 'moment'

// import { apolloClient } from '../../graphql/apollo'
// import { GET_CANDIDATES, GET_CANDIDATE } from '../../graphql/queries/candidates'

// import { IndexedDB } from './idb'
// const idb = new IndexedDB('metaspan.io')
import { StateManager } from '../state-manager'
// import test from 'node:test'
const stateManager = new StateManager('metaspan.io')
const STORAGE_KEY = 'candidate'

interface IPagination {
  page: number
  itemsPerPage: number
}

interface ISort {
  sort: string
  sortAsc: boolean
}

// interface IFilter {
//   valid: boolean
//   active: boolean
//   sort: string
//   sortAsc: boolean
// }

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
  filter: ICandidateListFilter
  ranges: TRanges
  options: IOption[]
  favourites: string[]
}

interface IState {
  initial: boolean // has the module been initialised
  chainId: string
  // updatedAt: null | moment.Moment
  // list: ICandidate[]
  polkadot: IChainState
  kusama?: IChainState
  // candidate: ICandidate
  democracy: any
  referenda: any[]
}

const initialState = {
  initial: true,
  chainId: 'kusama',
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
      sort: 'score',
      sortAsc: false
    },
    search: '',
    filter: { valid: false, active: false, sort: 'score', sortAsc: true },
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
      sort: 'score',
      sortAsc: false
    },
    search: '',
    filter: { valid: false, active: false, sort: 'score', sortAsc: false },
    options: {} as IOption[],
    ranges: {
      score: { min: 0, max: 0 },
      rank: { min: 0, max: 0 },
      bonded: { min: 0, max: 0 }
    },
    favourites: [
      'HyLisujX7Cr6D7xzb6qadFdedLt8hmArB6ZVGJ6xsCUHqmx',
      'FAR296Aqh9i8W5bi7BS7a8Bkhbw5LX5xCXP22c1Jvc2tM5v'
    ],
    list: [],
    filteredList: [],
    candidate: new Candidate({ valid: false, validity: [{ valid: false }] as ICandidateValidityItem[] } as ICandidate)
  } as IChainState,
  democracy: {},
  referenda: []
} as IState

// async function saveState (state: IState) {
//   console.debug('store/modules/candidate.ts: stateManager.saveState()', state)
//   // localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
//   // remove api from saved state
//   if (!state.initial) await idb.set(STORAGE_KEY, state)
// }

// async function clearState () {
//   console.debug('store/modules/candidate.ts: clearState()', STORAGE_KEY)
//   // localStorage.removeItem(STORAGE_KEY)
//   await idb.unset(STORAGE_KEY)
// }

// function getState (state: IState): IState {
//   // console.debug('store/modules/candidate.ts: getState()', state)
//   // const savedState = localStorage.getItem(STORAGE_KEY)
//   let ret: IState = initialState
//   idb.get(STORAGE_KEY).then((savedState) => {
//     if (savedState && savedState.chainId) {
//       console.debug('store/modules/candidate.ts: getState(): restoring from idb()')
//       // return JSON.parse(savedState)
//       // console.debug(savedState)
//       const mergedState = Object.assign({}, savedState, state)
//       console.debug(mergedState)
//       // return mergedState
//       ret = mergedState
//     } else {
//       console.debug('store/modules/candidate.ts: getState(): using initialState')
//       initialState.initial = false
//       const mergedState = Object.assign({}, initialState, state)
//       console.debug(initialState, state, mergedState)
//       // return mergedState
//       ret = mergedState
//     }
//   })
//   return ret
// }

interface IMutLoading {
  chain: string
  loading: boolean
}

async function initState () {
  return await stateManager.getState(STORAGE_KEY, initialState)
}

/* eslint-disable no-new */
const candidate = {
  namespaced: true,
  modules: {
  },
  // state: getState(initialState),
  state: stateManager.getStateSync(STORAGE_KEY, initialState), // .then(s => s),
  // state: initState(),
  getters: {
    apiConnected (state: IState) { return state[state.chainId]?.apiConnected || false },
    chainInfo (state: IState) { return state[state.chainId].chainInfo || {} },
    list (state: IState) { return state[state.chainId]?.list || [] },
    candidate (state: IState) { return state[state.chainId]?.candidate || {} },
    filteredList (state: IState) {
      console.debug('candidate.ts: getters.filteredList()', state.chainId)
      return state[state.chainId]?.filteredList || []
    },
    favourites (state: IState) { return state[state.chainId]?.favourites || [] },
    filter (state: IState) { return state[state.chainId]?.filter || {} },
    filtering (state: IState) { return state[state.chainId]?.filtering || false },
    loading (state: IState) { return state[state.chainId]?.loading || false },
    options (state: IState) { return state[state.chainId]?.options || {} },
    ranges (state: IState) { return state[state.chainId]?.ranges || [] },
    updatedAt (state: IState) { return moment(state[state.chainId]?.updatedAt) }
  },
  mutations: {
    async INIT (state: IState, value: any) {
      console.debug('store/modules/candidate.ts: mutations.INIT()', state, value)
      // state = { ...value }
      state = Object.assign(state, value)
      state[state.chainId].loading = false
      // await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    SET_LOADING (state: IState, { loading }: IMutLoading): void {
      console.debug('store/modules/candidate.ts: mutations.SET_LOADING()', state.chainId, loading)
      if (state[state.chainId]) state[state.chainId].loading = loading
      else console.warn('state[state.chainId] is', state[state.chainId])
      // state[state.chainId].loadingTimeout = setTimeout(() => {
      //   clearTimeout(state[state.chainId].loadingTimeout)
      // }, 10 * 1000)
    },
    SET_INITIAL (state, initial) {
      console.debug('store/modules/candidate.ts: mutations.SET_INITIAL()', initial)
      state.initial = initial
    },
    // eslint-disable-next-line
    async SET_CHAIN (state: IState, chainId: string): Promise<void> {
      console.debug('store/modules/candidate.ts: mutations.SET_CHAIN()', chainId)
      // console.debug('window.$polkadot', window.$polkadot)
      state.chainId = chainId
      if (!state.initial) await stateManager.saveState(STORAGE_KEY, state)
    },
    API_STATUS (state, { connected, chainId }) {
      state[chainId].apiConnected = connected
    },
    // eslint-disable-next-line
    async SET_FILTERING (state: IState, { value }: any): Promise<void> {
      state[state.chainId].filtering = value
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_LIST (state: IState, { list }: any): Promise<void> {
      console.debug('candidate.ts: mutations.SET_LIST()', state.chainId, list)
      let udata = [] as number[]
      let ranks = [] as number[]
      Vue.set(state[state.chainId], 'list', list.map((m: ICandidate) => new Candidate(m)))
      state[state.chainId].updatedAt = moment().utc().format()

      ranks = list.map((m) => {
        return m.rank
      }).sort((a, b) => {
        return a - b
      })
      udata = [...new Set(ranks)]
      udata = udata.slice(udata.length * 0.055, udata.length * 0.854)
      // console.debug('length', udata.length, 'min:', Math.min(...udata), 'max:', Math.max(...udata))
      state[state.chainId].ranges.rank = { min: Math.min(...udata), max: Math.max(...udata) }

      state[state.chainId].ranges.score = list
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
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_FILTERED_LIST (state: IState, { flist }: any): Promise<void> {
      // console.debug('SET_FILTERED_LIST', flist.length)
      // state.filteredList = flist
      Vue.set(state[state.chainId], 'filteredList', flist)
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_CANDIDATE (state: IState, { model }: any): Promise<void> {
      console.debug('SET_CANDIDATE', model)
      state[state.chainId].candidate = model
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_PAGINATION (state: IState, { pagination }: any): Promise<void> {
      console.debug('candidate.ts: SET_PAGINATION', state.chainId, pagination)
      state[state.chainId].pagination = pagination
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_OPTIONS (state: IState, { options }: any): Promise<void> {
      // console.debug('candidate.ts: SET_OPTIONS', state.chainId, options)
      state[state.chainId].options = options
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_FILTER (state: IState, { filter }: any): Promise<void> {
      console.debug('store/modules/candidate.ts: SET_FILTER()', state.chainId, filter)
      // state[state.chainId].filter = filter
      Object.assign(state[state.chainId].filter, filter)
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async SET_SEARCH (state: IState, { search }: any): Promise<void> {
      state[state.chainId].search = search
      await stateManager.saveState(STORAGE_KEY, state)
    },
    // eslint-disable-next-line
    async TOGGLE_FAV (state: IState, { stash }: any): Promise<void> {
      const idx = state[state.chainId].favourites.findIndex((v:string) => {
        return v === stash
      })
      // console.debug('idx', idx);
      if (idx > -1) {
        state[state.chainId].favourites = state[state.chainId].favourites.filter((f: string) => {
          return f !== stash
        })
      } else {
        state[state.chainId].favourites.push(stash)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_DEMOCRACY (state: IState, democracy: any) {
      state.democracy = democracy
    },
    async SET_REFERENDA (state: IState, referenda: any) {
      state.referenda = referenda
    },
    async ADD_REFERENDA (state: IState, item: any) {
      state.referenda.push(item)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ commit, dispatch, state, rootState }: any) {
      console.debug('store/modules/candidate.ts: init()', rootState.chainId, state)
      // state: getState() already does this
      // const sstate = await getState(state)
      await commit('SET_CHAIN', rootState.chainId)
      await commit('INIT', state)
      // await dispatch('setChain', sstate.chainId, { root: true })
      await commit('SET_INITIAL', false)
    },
    async setChain ({ commit, dispatch }, chainId) {
      console.debug('store/modules/candidate.ts: setChain()', chainId)
      await commit('SET_CHAIN', chainId)
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
    // async getListNew ({ rootState, state, commit, dispatch }) {
    //   const variables = {
    //     chain: rootState.chain,
    //     search: state.search
    //     // sort: state.options.sortBy,
    //     // sortDir: state.options.sortDir, // asc / desc
    //     // offset: (state.pagination.page - 1) * state.pagination.itemsPerPage || 0,
    //     // limit: state.pagination.itemsPerPage || 10
    //   }
    //   try {
    //     // const res = await axios.get(`/function/w3f-validators-${chain}`, { params })
    //     const res = await apolloClient.query({
    //       query: GET_CANDIDATES,
    //       variables
    //     })
    //     if (res.data) {
    //       // console.log('got data', res.data)
    //       await commit('SET_LIST', {
    //         list: res.data.Validators,
    //         count: res.data.ValidatorCount
    //         // limit: variables.limit,
    //         // offset: variables.offset
    //       })
    //       await dispatch('filterList')
    //     }
    //   } catch (err) {
    //     console.error(err)
    //   } finally {
    //     await commit('SET_LOADING', false)
    //   }
    // },
    // eslint-disable-next-line
    async getList ({ rootState, state, commit, dispatch }: any) {
      console.debug('store/modules/candidate.ts: getList()', state.chainId, 'initial:', state.initial)
      let list = []
      // console.debug('store/modules/candidate.ts: getList(): updatedAt', state[state.chainId].updatedAt.toString())
      if (!state[state.chainId]?.updatedAt || moment().diff(moment(state[state.chainId]?.updatedAt), 'seconds') > 60) {
        console.debug('store/modules/candidate.ts: getList(): reloading list from api', state.chainId)
        try {
          // eslint-disable-next-line
          let res = null as any
          await commit('SET_LOADING', { loading: true })
          // var res = await axios.get(`${baseUrl}/candidates`)
          res = await axios.get(
            // 'https://619wrsnit5.execute-api.eu-west-2.amazonaws.com/default/kusama-1kv-candidates'
            // `//api.metaspan.io/api/${state.chainId}/candidate`
            `${rootState.baseUrl}/api/${state.chainId}/candidate`
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
        console.log(`age of cache: ${moment().diff(moment(state[state.chainId].updatedAt), 'seconds')} seconds`)
      }
    },
    // eslint-disable-next-line
    async paginate ({ state, commit }: any, { pagination }: any) {
      console.debug('store/modules/candidate.ts: paginate()', pagination)
      await commit('SET_PAGINATION', { pagination })
      const options = Object.assign(state[state.chainId].options, pagination)
      await commit('SET_OPTIONS', { options })
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
      const filter: ICandidateListFilter = state[state.chainId].filter
      // const sort: ICandidateListSort = state[state.chainId].sort
      const sort = { sort: filter.sort, sortAsc: filter.sortAsc }
      const search: string = state[state.chainId].search
      const favourites: string[] = state[state.chainId].favourites
      console.debug('store/modules/candidate.ts: filter, sort, search', filter, sort, search, favourites)
      const flist = state[state.chainId].list
        .filter((item: ICandidate, idx: number) => {
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
        })
        .sort((a: ICandidate, b:ICandidate): number => {
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
    async setCandidate ({ rootState, state, commit }: any, { chainId, stash }: any) {
      console.debug('store/modules/candidate.ts: setCandidate()', chainId, stash)
      let v = state[chainId].list.find((i: ICandidate) => i.stash === stash)
      if (!v) {
        console.debug('not in cache... axios direct')
        await commit('SET_LOADING', { chainId, loading: true })
        // const res = await axios.get(`//api.metaspan.io/api/kusama/candidate/${stash}`)
        const res = await axios.get(`${rootState.baseUrl}/api/${chainId}/candidate/${stash}`)
        if (res?.data) {
          v = res.data
        } else {
          console.warn('API ERROR', res)
        }
        await commit('SET_LOADING', { chainId, loading: false })
      }
      await commit('SET_CANDIDATE', { chainId, model: v })
      // await dispatch('polkadot/get', stash, {root:true})
    },
    // not here, the CandidateNominators.vue is using gql
    // async getNominators ({ rootState, commit }, { chainId, stash }) {
    //   const res = await axios.get(`${rootState.baseUrl}/api/${chainId}/candidate/${stash}`)
    //   if (res?.data) {
    //     commit('', res.data)
    //   }
    // },
    // eslint-disable-next-line
    async setLoading ({ commit }: any, { chain, value }: any) {
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
      stateManager.clearState(STORAGE_KEY)
    },
    async getDemocracy ({ rootState, state, commit }: any, { stash }: any): Promise<void> {
      console.debug('store/modules/candidate.ts: actions.getDemocracy()')
      const res = await axios.get(`${rootState.baseUrl}/api/${state.chainId}/query/democracy/votingOf?accountId=${stash}`)
      if (res.data) {
        await commit('SET_DEMOCRACY', res.data.votingOf || {})
      }
    },
    async getReferenda ({ rootState, state, commit }: any, { stash }: any): Promise<void> {
      console.debug('store/modules/candidate.ts: actions.getReferenda()')
      commit('SET_REFERENDA', [])
      let res: any = await axios.get(`${rootState.baseUrl}/api/${state.chainId}/query/referenda/referendumCount`)
      if (res.data && res.data.referendumCount) {
        const count = res.data.referendumCount
        console.debug('referendumCount', count)
        const referenda: any[] = []
        for (let i = count; i > 0; i--) {
          res = await axios.get(`${rootState.baseUrl}/api/${state.chainId}/query/convictionVoting/votingFor`, {
            params: {
              accountId: stash,
              id: i
            }
          })
          const info = await axios.get(`${rootState.baseUrl}/api/${state.chainId}/query/referenda/referendumInfoFor`, { params: { id: i } })
          referenda.push({ id: i, ...res?.data?.votingFor, info: info.data.referendumInfoFor })
          await commit('ADD_REFERENDA', { id: i, ...res?.data?.votingFor, info: info.data.referendumInfoFor })
        }
        // res = await axios.get(`${rootState.baseUrl}/api/${state.chainId}/query/democracy/votingOf?accountId=${stash}`)
        // if (res.data) {
        //   await commit('SET_DEMOCRACY', res.data.votingOf || {})
        // }
        // commit('SET_REFERENDA', referenda)
      }
    }
  }
}

export default candidate