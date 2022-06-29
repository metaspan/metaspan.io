import Vue from 'vue'
import Vuex from 'vuex'

import polkadot from './modules/polkadot'
import validator from './modules/validator'
import candidate from './modules/candidate'

Vue.use(Vuex)

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}

export default new Vuex.Store({
  state: {
    dark: false,
    showSettingsDialog: false,
    alerts: [] as IAlert[]
  },
  mutations: {
    SET_DARK (state, value) {
      state.dark = value
    },
    SET_SHOW_SETTINGS_DIALOG (state, value) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.showSettingsDialog = value
    },
    ADD_ALERT (state, alert: IAlert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts.push(alert)
    },
    CLEAR_ALERT (state, alert) {
      // console.debug('SET_SHOW_SETTINGS_DIALOG', value)
      state.alerts = state.alerts.filter(f => f.id !== alert.id)
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
    },
    addAlert ({ commit }, alert: IAlert) {
      commit('ADD_ALERT', alert)
    },
    clearAlert ({ commit }, alert: IAlert) {
      commit('CLEAR_ALERT', alert)
    }
  },
  modules: {
    validator,
    candidate,
    polkadot
  }
})
