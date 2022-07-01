import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

import vuetify from './plugins/vuetify'

import { SubstrateAPI } from './plugins/substrate'
Vue.prototype.$substrate = new SubstrateAPI({ chain: 'kusama' })

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
