
// import { SubstrateAPI } from '../../plugins/substrate'
// Vue.prototype.$substrate = new SubstrateAPI({ chain: 'kusama' })

const api = {
  namespaced: true,
  state: {
    api: null,
    chain: 'kusama',
    decimals: {
      0: 1,
      1: 10,
      2: 100,
      3: 1000,
      4: 10000,
      5: 100000,
      6: 1000000,
      7: 10000000,
      8: 100000000,
      9: 1000000000,
      10: 10000000000,
      11: 100000000000,
      12: 1000000000000
    },
    polkadot: {
      connected: false,
      chainInfo: {}
    },
    kusama: {
      connected: false,
      chainInfo: {}
    }
  },
  getters: {
    chainInfo (state) {
      return state[state.chain].chainInfo
    }
  },
  mutations: {
    INIT (state, { api }) {
      state.api = api
    },
    SET_CHAIN (state, { chain }) {
      state.chain = chain
    },
    SET_CHAIN_INFO (state, { chain, chainInfo }) {
      state[chain].chainInfo = chainInfo
    },
    SET_API_CONNECTED (state, { chain, connected }) {
      state[chain].connected = connected
    }
  },
  actions: {
    async init ({ commit }) {
      console.debug('store/modules/substrate.ts: init()')
      // const s = new SubstrateAPI({
      //   lite: true
      // })
      // await s.connect()
      // await commit('INIT', { api: s })
    },
    async setChain ({ commit }, { chain }) {
      console.debug('store/modules/substrate.ts: setChain()', chain)
      await commit('SET_CHAIN', { chain })
    },
    async apiClose ({ dispatch }) {
      console.debug('store/modules/substrate.ts: apiclose()')
      await dispatch('apiDisconnected', { chain: 'polkadot' })
      await dispatch('apiDisconnected', { chain: 'kusama' })
    },
    async setChainInfo ({ commit }, { chain, chainInfo }) {
      console.debug('store/modules/substrate.ts: setChainInfo()', chain, chainInfo)
      await commit('SET_CHAIN_INFO', { chain, chainInfo })
    },
    async apiConnected ({ commit }, { chain }) {
      console.debug('store/modules/substrate.ts: apiConnected()', chain)
      // console.log(state[chain])
      // const chainInfo = await state[chain].api.registry.getChainProperties()
      // console.log(chainInfo);
      commit('SET_API_CONNECTED', { chain, connected: true })
    },
    async apiDisconnected ({ commit }, { chain }) {
      console.debug('store/modules/substrate.ts: apiDisconnected()', chain)
      commit('SET_API_CONNECTED', { chain, connected: false })
    },
    async apiError ({ state }, error) {
      console.log('API ERROR chain', state.chain)
      console.error(error)
    }
    // async getValidators ({ state, commit }) {
    //   const vals = await state[state.chain].api.query.system.validators()
    //   console.log(vals.toJSON())
    // }
    // async getCandidates ({ state, commit }) {
    //   const vals = await state[state.chain].api.query.system.validators()
    //   console.log(vals.toJSON())
    // }
  }
}

export default api
