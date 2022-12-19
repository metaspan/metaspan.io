
import Vue from 'vue'
import { IValidator } from '@/types/global'
import axios from 'axios'
import { StateManager } from '../state-manager'

const stateManager = new StateManager('metaspan.io')
const STORAGE_KEY = 'selector'

interface IFilter {
  is1kv: boolean
  hasId: boolean
  active: boolean
  commission: [number, number]
  maxNominators: number
}

interface IState {
  initial: boolean
  chainId: string
  loading: boolean
  list: IValidator[]
  filter: IFilter
  filteredList: IValidator[]
  validator: IValidator
}

const initialState = {
  initial: true,
  chainId: 'kusama',
  loading: false,
  list: [],
  filter: {
    is1kv: false,
    hasId: false,
    active: false,
    commission: [1, 15],
    maxNominators: 300
  },
  filteredList: [],
  validator: {} as IValidator
} as IState

// TODO what is this used for?
async function initState () {
  return await stateManager.getState(STORAGE_KEY, initialState)
}

/* eslint-disable no-new */
const selector = {
  namespaced: true,
  state: stateManager.getStateSync(STORAGE_KEY, initialState), // .then(s => s),
  mutations: {
    async INIT (state: IState, value: any) {
      console.debug('store/modules/selector.ts: mutations.INIT()', state, value)
      // state = { ...value }
      state = Object.assign(state, value)
      state.loading = false
      // await stateManager.saveState(STORAGE_KEY, state)
    },
    SET_INITIAL (state: IState, initial: boolean): void {
      state.initial = initial
    },
    SET_LOADING (state: IState, loading: boolean): void {
      state.loading = loading
    },
    async SET_CHAINID (state: IState, chainId: string) {
      state.chainId = chainId
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async ADD_VALIDATOR (state: IState, model: IValidator) {
      console.debug('store/modules/pool.ts: ADD_VALIDATOR()', model.stash)
      const px = state.list.findIndex(f => f.stash === model.stash)
      if (px > -1) {
        state.list[px] = model
      } else {
        state.list.push(model)
      }
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_FILTER (state: IState, filter: any) {
      state.filter = filter
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_LIST (state: IState, list: IValidator[]) {
      console.debug('SET_LIST', list)
      state.list = list
      await stateManager.saveState(STORAGE_KEY, state)
    },
    async SET_VALIDATOR (state: IState, validator: any) {
      state.validator = validator
    }
  },
  actions: {
    async init ({ commit, dispatch, state, rootState }: any) {
      console.debug('store/modules/selector.ts: init()', rootState.chainId, state)
      // state: getState() already does this
      // const sstate = await getState(state)
      await commit('SET_CHAINID', rootState.chainId)
      await commit('INIT', state)
      // await dispatch('setChain', sstate.chainId, { root: true })
      await commit('SET_INITIAL', false)
    },
    // eslint-disable-next-line
    async setChainId ({ commit }, chainId: string) {
      await commit('SET_CHAIN', { chainId })
    },
    async loading ({ commit }: any, loading: boolean) {
      commit('SET_LOADING', loading)
    },
    async addValidator ({ commit }, model: IValidator) {
      // console.debug('store/modules/pool.ts: addPool()', pool)
      await commit('ADD_VALIDATOR', model)
    },
    async setFilter ({ commit }, filter: any) {
      commit('SET_FILTER', filter)
    },
    // async getList ({ state, commit }: any) {
    //   const ret = await axios.get(`https://api.metaspan.io/api/${state.chainId}`)
    //   await commit('SET_LIST')
    // },
    // eslint-disable-next-line
    async setList ({ commit, dispatch }: any, list: IValidator[]) {
      await commit('SET_LIST', list)
    },
    async setValidator ({ state, commit }: any, stash: string) {
      const ret = await axios.get(`https://api.metaspan.io/api/${state.chainId}/validator/${stash}`)
      commit('SET_VALIDATOR', ret.data)
    }
  }
}

export default selector
