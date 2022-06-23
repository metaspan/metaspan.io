import Vue from 'vue'
import Vuex from 'vuex'

import polkadot from './modules/polkadot'
import validator from './modules/validator'
import candidate from './modules/candidate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dark: false,
    showSettingsDialog: false
  },
  mutations: {
    SET_DARK (state, value) {
      state.dark = value
    },
    SET_SHOW_SETTINGS_DIALOG (state, value) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.showSettingsDialog = value
    }
  },
  actions: {
    // eslint-disable-next-line
    init ({ dispatch }: any) {
      // dispatch('polkadot/init', {}, { root: true })
      dispatch('candidate/init', {}, { root: true })
    },
    setDark ({ commit }, dark) {
      commit('SET_DARK', dark)
    },
    setShowSettingsDialog ({ commit }, value) {
      commit('SET_SHOW_SETTINGS_DIALOG', value)
    }
  },
  modules: {
    validator,
    candidate,
    polkadot
  }
})
