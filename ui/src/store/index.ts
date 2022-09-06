import Vue from 'vue'
import Vuex from 'vuex'

import substrate from './modules/substrate'
import polkadot from './modules/polkadot'
import validator from './modules/validator'
import candidate from './modules/candidate'
import pool from './modules/pool'

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

Vue.use(Vuex)

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}

export default new Vuex.Store({
  state: {
    loading: false,
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.metaspan.io'
      : `//${window.location.hostname}:${window.location.port}`,
    dark: false,
    showSettingsDialog: false,
    showNavBar: false,
    alerts: [] as IAlert[],
    chains,
    chain: 'kusama'
  },
  mutations: {
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
    SET_SHOW_NAVBAR (state, value) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.showNavBar = value
    },
    ADD_ALERT (state, alert: IAlert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts.push(alert)
    },
    CLEAR_ALERT (state, alert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts = state.alerts.filter(f => f.id !== alert.id)
    },
    async SET_CHAIN (state, chain) {
      state.chain = chain
    }
  },
  actions: {
    // eslint-disable-next-line
    init ({ dispatch }: any) {
      dispatch('substrate/init', {}, { root: true })
      dispatch('candidate/init', {}, { root: true })
      dispatch('pool/init', {}, { root: true })
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
    showNavBar ({ commit }, value) {
      commit('SET_SHOW_NAVBAR', value)
    },
    toggleNavBar ({ commit, state }) {
      commit('SET_SHOW_NAVBAR', !state.showNavBar)
    },
    resetCache ({ dispatch }) {
      console.debug('store/index.ts: actions.resetCache()')
      dispatch('candidate/resetCache', {}, { root: true })
      dispatch('pool/resetCache', {}, { root: true })
    },
    async setChain ({ commit, dispatch }, { chain }) {
      await commit('SET_CHAIN', chain)
      await dispatch('substrate/setChain', { chain })
      await dispatch('candidate/setChain', { chain })
      await dispatch('pool/setChain', { chain })
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
    pool
  }
})
