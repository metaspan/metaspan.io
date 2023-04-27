// vuex-shim.d.ts
// https://vuejs.org/api/utility-types.html#componentcustomprops
import { ComponentCustomProperties } from 'vue'
// import { SubstrateAPI } from './plugins/substrate'
import { apolloProvider } from './graphql/apollo'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $apollo: apolloProvider
  }
}
