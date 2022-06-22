import Vue from 'vue'
import Vuex from 'vuex'

import polkadot from './modules/polkadot'
import validator from './modules/validator'
import candidate from './modules/candidate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    // eslint-disable-next-line
    init ({ dispatch }: any) {
      // dispatch('polkadot/init', {}, { root: true })
      dispatch('candidate/init', {}, { root: true })
    }
  },
  modules: {
    validator,
    candidate,
    polkadot
  }
})
