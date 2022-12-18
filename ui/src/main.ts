import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import vuetify from './plugins/vuetify'

import { apolloProvider } from './graphql/apollo'

// this.$utils plugin
import utils from './plugins/utils'
// Vue.use(utils, {})
Vue.prototype.$utils = utils

// eslint-disable-next-line
import { SubstrateAPI } from './plugins/substrate'
Vue.prototype.$substrate = new SubstrateAPI({ lite: false })

Vue.config.productionTip = true // false

new Vue({
  router,
  store,
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
