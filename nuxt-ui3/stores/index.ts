import { defineStore } from 'pinia'
import { usePolkadotStore } from './polkadot'
import { useSubstrateStore } from './substrate'
import { useCandidateStore } from './candidate'
import { usePoolStore } from './pool'

// export const usePolkadotStore

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

interface IAlert {
  id: string
  type: 'info' | 'warning' | 'error'
  title?: string
  text: string
}
const isServer = typeof window === 'undefined'
const baseUrl = 'https://api.metaspan.io'

// interface IState {
//   appVersion: string
//   initial: boolean
//   loading: boolean
//   baseUrl: string
//   dark: boolean
//   showSettingsDialog: boolean
//   showNavDrawer: boolean
//   alerts: IAlert[]
//   chains: any
//   chainId: string
// }

export const useStore = defineStore('store', {
  state: () => ({
    appVersion: process.env.PACKAGE_VERSION || '0',
    initial: true,
    loading: false,
    // baseUrl: process.env.NODE_ENV === 'production'
    //   ? 'https://api.metaspan.io'
    //   : `//${window.location.hostname}:${window.location.port}`,
    baseUrl,
    dark: false,
    showSettingsDialog: false,
    showNavDrawer: false,
    alerts: [] as IAlert[],
    chains,
    chainId: 'kusama'
  }),
  actions: {
    async init () {
      // await commit('SET_LOADING', true)
      this.loading = true
      // await dispatch('setChainId', state.chainId) // TODO: is this really necessary?
      this.setChainId(this.chainId)
      // await dispatch('substrate/init', {}, { root: true })
      useSubstrateStore().init()
      // await dispatch('candidate/init', {}, { root: true })
      useCandidateStore().init()
      // await dispatch('pool/init', {}, { root: true })
      usePoolStore().init()
      // await dispatch('selector/init', {}, { root: true })
      // await commit('SET_INITIAL', false)
      this.initial = false
      // await commit('SET_LOADING', false)
      this.loading = false
    },
    setLoading (loading: boolean) {
      // commit('SET_LOADING', loading)
      this.loading = loading
    },
    setDark (dark: boolean) {
      // commit('SET_DARK', dark)
      this.dark = dark
    },
    setShowSettingsDialog (value: boolean) {
      // commit('SET_SHOW_SETTINGS_DIALOG', value)
      this.showSettingsDialog = value
    },
    addAlert (alert: IAlert) {
      // commit('ADD_ALERT', alert)
      this.alerts.push(alert)
    },
    clearAlert (alert: IAlert) {
      // commit('CLEAR_ALERT', alert)
      this.alerts = this.alerts.filter(f => f.id !== alert.id)
    },
    setShowNavDrawer (value: boolean) {
      // commit('SET_SHOW_NAVDRAWER', value)
      this.showNavDrawer = value
    },
    toggleNavDrawer () {
      // commit('SET_SHOW_NAVDRAWER', !state.showNavDrawer)
      this.showNavDrawer = !this.showNavDrawer
    },
    resetCache () {
      console.debug('stores/index.ts: actions.resetCache()')
      // dispatch('candidate/resetCache', {}, { root: true })
      // dispatch('pool/resetCache', {}, { root: true })
    },
    async setChainId (chainId: string) {
      console.debug('stores/index.js: actions.setChain()', chainId)
      // await commit('SET_CHAIN_ID', chainId)
      this.chainId = chainId
      // await dispatch('substrate/setChainId', chainId)
      useSubstrateStore().setChainId(chainId)
      // await dispatch('candidate/setChainId', chainId)
      // useCandidateStore().setChainId(chainId)
      // await dispatch('pool/setChainId', chainId)
      usePoolStore().setChainId(chainId)
    },
    // async apiClose ({ dispatch }) {
    //   await dispatch('substrate/apiClose')
    //   await dispatch('candidate/apiClose')
    //   await dispatch('pool/apiClose')
    // },
    // async apiConnected ({ dispatch }, { chain }) {
    //   await dispatch('substrate/apiConnected', { chain })
    //   await dispatch('candidate/apiStatus', { connected: true, chain })
    //   await dispatch('pool/apiStatus', { connected: true, chain })
    // },
    // async apiDisconnected ({ dispatch }, { chain }) {
    //   await dispatch('substrate/apiDisconnected', { chain })
    //   await dispatch('candidate/apiStatus', { connected: false, chain })
    //   await dispatch('pool/apiStatus', { connected: false, chain })
    // }
  }
})

// export default store
