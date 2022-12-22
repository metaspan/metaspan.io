import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import vuetify from './plugins/vuetify'
import { SubstrateAPI } from './plugins/substrate'
import { apolloProvider } from './graphql/apollo'
import utils from './plugins/utils'
import { VuePlausible } from 'vue-plausible'

// this.$utils plugin
Vue.prototype.$utils = utils
// this.$substrate plugin
Vue.prototype.$substrate = new SubstrateAPI({ lite: false })
// traffic & clicks
Vue.use(VuePlausible, {
  // see configuration section
  domain: 'metaspan.io',
  trackLocalhost: true,
  apiHost: 'https://click.metaspan.io'
})

Vue.config.productionTip = true // false

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
