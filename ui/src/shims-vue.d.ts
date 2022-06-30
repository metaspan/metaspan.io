declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

import { PolkadotAPI } from './plugins/polkadot'
// Vue.prototype.$polkadot = new PolkadotAPI({ chain: 'kusama' })

declare module 'vue/types/vue' {
  const $polkadot = new PolkadotAPI({ chain: 'kusama' })
  interface Vue {
    $polkadot: $polkadot,
  }
}
