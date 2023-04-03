
// import { SubstrateAPI } from '../../plugins/substrate'
// Vue.prototype.$substrate = new SubstrateAPI({ chain: 'kusama' })

interface IChainState {
  connected: boolean
  chainInfo: any
}
interface IState {
  api: any
  chainId: string
  decimals: Record<number, number>
  polkadot: any
  kusama: any
  chains: Record<string,IChainState>
}

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
    chains: {
      polkadot: {
        connected: false,
        chainInfo: {}
      },
      kusama: {
        connected: false,
        chainInfo: {}
      }
    }
  },
  getters: {
    chainInfo (state: IState) {
      return state.chains[state.chainId]?.chainInfo || {}
    },
    connected (state: IState) {
      return state.chains[state.chainId]?.connected
    }
  },
  mutations: {
    INIT (state: IState, { api }: any) {
      state.api = api
    },
    SET_CHAIN_ID (state: IState, chainId: string) {
      state.chainId = chainId
    },
    SET_CHAIN_INFO (state: IState, { chainId, chainInfo }: any) {
      state.chains[chainId].chainInfo = chainInfo
    },
    SET_API_CONNECTED (state: IState, { chainId, connected }: any) {
      state.chains[chainId].connected = connected
    }
  },
  actions: {
    async init ({ commit }: any) {
      console.debug('store/modules/substrate.ts: init()')
      // const s = new SubstrateAPI({
      //   lite: true
      // })
      // await s.connect()
      // await commit('INIT', { api: s })
    },
    async setChainId ({ commit }: any, chainId: string) {
      console.debug('store/modules/substrate.ts: setChainId()', chainId)
      await commit('SET_CHAIN_ID', chainId)
    },
    async apiClose ({ dispatch }: any) {
      console.debug('store/modules/substrate.ts: apiclose()')
      await dispatch('apiDisconnected', { chainId: 'polkadot' })
      await dispatch('apiDisconnected', { chainId: 'kusama' })
    },
    async setChainInfo ({ commit }: any, { chainId, chainInfo }: any) {
      console.debug('store/modules/substrate.ts: setChainInfo()', chainId, chainInfo)
      await commit('SET_CHAIN_INFO', { chainId, chainInfo: { ...chainInfo } })
    },
    async apiConnected ({ commit }: any, chainId: string) {
      console.debug('store/modules/substrate.ts: apiConnected()', chainId)
      // console.log(state[chain])
      // const chainInfo = await state[chain].api.registry.getChainProperties()
      // console.log(chainInfo);
      commit('SET_API_CONNECTED', { chainId, connected: true })
    },
    async apiDisconnected ({ commit }: any, chainId: string) {
      console.debug('store/modules/substrate.ts: apiDisconnected()', chainId)
      commit('SET_API_CONNECTED', { chainId, connected: false })
    },
    async apiError ({ state }: any, error: any) {
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
