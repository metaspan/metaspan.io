
import { SubstrateAPI } from './plugins/substrate'

// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }

export interface SubstrateAPIOptions {
  lite: boolean
}

export interface SubstratePlugin {
  install: (app: App, options?: SubstrateAPIOptions) => void
}
