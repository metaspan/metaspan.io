import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import vuetify from './plugins/vuetify'

// import { apolloProvider } from './graphql/apollo'

import { SubstrateAPI } from './plugins/substrate'
Vue.prototype.$substrate = new SubstrateAPI({ lite: false, endpoint: 'dwellir' })

Vue.config.productionTip = true // false

new Vue({
  router,
  store,
  vuetify,
  // apolloProvider,
  render: h => h(App)
}).$mount('#app')
