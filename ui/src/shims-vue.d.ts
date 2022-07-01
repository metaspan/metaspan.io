declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import { SubstrateAPI } from './plugins/substrate'
// Vue.prototype.$polkadot = new PolkadotAPI({ chain: 'kusama' })

declare module 'vue/types/vue' {
  const $substrate = new SubstrateAPI({ chain: 'kusama' })
  interface Vue {
    $substrate: $substrate,
  }
}
