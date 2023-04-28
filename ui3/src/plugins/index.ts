/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import store from '../store'
import router from '../router'
import { SubstratePlugin } from './substrate'
import { PlausiblePlugin } from './plausible'
import plausibleModule from '@/store/modules/plausible'
import { apolloProvider } from './apollo'
import { DefaultApolloClient } from '@vue/apollo-composable'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  loadFonts()
  app
    .use(vuetify)
    .use(store)
    .use(router)
    .use(SubstratePlugin, { lite: false })
    // .provide('$substrate', substrate)
    .use(apolloProvider)
    .provide(DefaultApolloClient, apolloProvider.defaultClient)
    // .use(PlausiblePlugin, store.getters['plausible/options'])
    .use(PlausiblePlugin, plausibleModule.state.options)
}
