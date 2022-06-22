// vuex-shim.d.ts

import { ComponentCustomProperties } from 'vue'
// import { Store } from 'vuex'
import { Store } from '@/store'

declare module '@vue/runtime-core' {
  // Declare your own store states.
  // interface State {
  //   count: number
  // }

  interface ComponentCustomProperties {
    $store: Store<State>
  }
}