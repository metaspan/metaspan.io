
// import { SubstrateAPI } from '../../plugins/substrate'
// Vue.prototype.$substrate = new SubstrateAPI({ chain: 'kusama' })

const api = {
  namespaced: true,
  state: {
    api: null,
    chainId: 'kusama',
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
      return state[state.chainId]?.chainInfo || {}
    },
    connected (state) {
      return state[state.chainId]?.connected
    }
  },
  mutations: {
    INIT (state, { api }) {
      state.api = api
    },
    SET_CHAIN_ID (state, chainId) {
      state.chainId = chainId
    },
    SET_CHAIN_INFO (state, { chainId, chainInfo }) {
      state[chainId].chainInfo = chainInfo
    },
    SET_API_CONNECTED (state, { chainId, connected }) {
      state[chainId].connected = connected
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
    async setChainId ({ commit }, chainId) {
      console.debug('store/modules/substrate.ts: setChainId()', chainId)
      await commit('SET_CHAIN_ID', chainId)
    },
    async apiClose ({ dispatch }) {
      console.debug('store/modules/substrate.ts: apiclose()')
      await dispatch('apiDisconnected', { chainId: 'polkadot' })
      await dispatch('apiDisconnected', { chainId: 'kusama' })
    },
    async setChainInfo ({ commit }, { chainId, chainInfo }) {
      console.debug('store/modules/substrate.ts: setChainInfo()', chainId, chainInfo)
      await commit('SET_CHAIN_INFO', { chainId, chainInfo })
    },
    async apiConnected ({ commit }, chainId) {
      console.debug('store/modules/substrate.ts: apiConnected()', chainId)
      // console.log(state[chain])
      // const chainInfo = await state[chain].api.registry.getChainProperties()
      // console.log(chainInfo);
      commit('SET_API_CONNECTED', { chainId, connected: true })
    },
    async apiDisconnected ({ commit }, chainId) {
      console.debug('store/modules/substrate.ts: apiDisconnected()', chainId)
      commit('SET_API_CONNECTED', { chainId, connected: false })
    },
    async apiError ({ state }, error) {
      console.log('API ERROR chain', state.chainId)
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
