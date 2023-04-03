// import Vue from 'vue'
import { createStore } from 'vuex'

import substrate from './modules/substrate'
import polkadot from './modules/polkadot'
import validator from './modules/validator'
import candidate from './modules/candidate'
import pool from './modules/pool'
import selector from './modules/selector'

import { StateManager } from './state-manager'
const stateManager = new StateManager('metaspan.io')
const STORAGE_KEY = 'index'

const chains = {
  kusama: {
    id: 'kusama',
    name: 'Kusama',
    icon: 'assets/kusama-logo.png'
  },
  polkadot: {
    id: 'polkadot',
    name: 'Polkadot',
    icon: 'assets/polkadot-logo.png'
  }
}

// Vue.use(Vuex)

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}

export default createStore({
  state: {
    appVersion: process.env.PACKAGE_VERSION || '0',
    initial: true,
    loading: false,
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.metaspan.io'
      : `//${window.location.hostname}:${window.location.port}`,
    dark: false,
    showSettingsDialog: false,
    showNavDrawer: false,
    alerts: [] as IAlert[],
    chains,
    chainId: 'kusama'
  },
  mutations: {
    SET_INITIAL (state, initial) {
      state.initial = initial
    },
    SET_LOADING (state, loading) {
      state.loading = loading
    },
    SET_DARK (state, value) {
      state.dark = value
    },
    SET_SHOW_SETTINGS_DIALOG (state, value) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.showSettingsDialog = value
    },
    SET_SHOW_NAVDRAWER (state, value) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.showNavDrawer = value
    },
    ADD_ALERT (state, alert: IAlert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts.push(alert)
    },
    CLEAR_ALERT (state, alert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts = state.alerts.filter(f => f.id !== alert.id)
    },
    async SET_CHAIN_ID (state, chainId) {
      state.chainId = chainId
      stateManager.saveState('index', state)
    }
  },
  actions: {
    // eslint-disable-next-line
    async init ({ state, dispatch, commit }: any) {
      await commit('SET_LOADING', true)
      await dispatch('setChainId', state.chainId) // TODO: is this really necessary?
      await dispatch('substrate/init', {}, { root: true })
      await dispatch('candidate/init', {}, { root: true })
      await dispatch('pool/init', {}, { root: true })
      await dispatch('selector/init', {}, { root: true })
      await commit('SET_INITIAL', false)
      await commit('SET_LOADING', false)
    },
    setLoading ({ commit }, loading) {
      commit('SET_LOADING', loading)
    },
    setDark ({ commit }, dark) {
      commit('SET_DARK', dark)
    },
    setShowSettingsDialog ({ commit }, value) {
      commit('SET_SHOW_SETTINGS_DIALOG', value)
    },
    addAlert ({ commit }, alert: IAlert) {
      commit('ADD_ALERT', alert)
    },
    clearAlert ({ commit }, alert: IAlert) {
      commit('CLEAR_ALERT', alert)
    },
    showNavDrawer ({ commit }, value) {
      commit('SET_SHOW_NAVDRAWER', value)
    },
    toggleNavDrawer ({ commit, state }) {
      commit('SET_SHOW_NAVDRAWER', !state.showNavDrawer)
    },
    resetCache ({ dispatch }) {
      console.debug('store/index.ts: actions.resetCache()')
      dispatch('candidate/resetCache', {}, { root: true })
      dispatch('pool/resetCache', {}, { root: true })
    },
    async setChainId ({ commit, dispatch }, chainId) {
      console.debug('store/index.js: actions.setChain()', chainId)
      await commit('SET_CHAIN_ID', chainId)
      await dispatch('substrate/setChainId', chainId)
      await dispatch('candidate/setChainId', chainId)
      await dispatch('pool/setChainId', chainId)
    },
    async apiClose ({ dispatch }) {
      await dispatch('substrate/apiClose')
      await dispatch('candidate/apiClose')
      await dispatch('pool/apiClose')
    },
    async apiConnected ({ dispatch }, { chain }) {
      await dispatch('substrate/apiConnected', { chain })
      await dispatch('candidate/apiStatus', { connected: true, chain })
      await dispatch('pool/apiStatus', { connected: true, chain })
    },
    async apiDisconnected ({ dispatch }, { chain }) {
      await dispatch('substrate/apiDisconnected', { chain })
      await dispatch('candidate/apiStatus', { connected: false, chain })
      await dispatch('pool/apiStatus', { connected: false, chain })
    }
  },
  modules: {
    substrate,
    validator,
    candidate,
    polkadot,
    pool,
    selector
  }
})
