// Composables
import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
// import { PlausiblePlugin } from '@/plugins/plausible'
import Plausible from 'plausible-tracker'

import Home from '../views/Home.vue'
import ChainHome from '@/components/ChainHome.vue'
import Validators from '@/components/Validators.vue'
import Nominators from '@/components/Nominators.vue'
import Candidates from '@/components/Candidates.vue'
import Candidate from '@/components/Candidate.vue'
import Pools from '@/components/Pools.vue'
import Pool from '@/components/Pool.vue'
import ValidatorsSelector from '@/components/ValidatorsSelector.vue'
import ValidatorSelector from '@/components/ValidatorSelector.vue'
import Identities from '@/components/Identities.vue'

import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/kusama',
    name: 'KusamaHome',
    component: ChainHome,
    props: { chainId: 'kusama' },
    children: [
      { path: 'candidate', name: 'KusamaCandidates', component: Candidates, meta: { title: 'metaspan.io - 1kv' }, props: { chain: 'kusama' } },
      { path: 'candidate/:stash', name: 'KusamaCandidate', component: Candidate, props: true, meta: { title: 'metaspan.io - kusama 1kv' } },
      { path: 'pool', name: 'KusamaPools', component: Pools, meta: { title: 'metaspan.io - pools' }, props: true },
      // { path: 'pool/:id', name: 'KusamaPool', component: Pool, props (route) { return { id: parseInt(route.params.id) } }, meta: { title: 'metaspan.io - kusama pool' } },
      { path: 'pool/:id', name: 'KusamaPool', component: Pool, props: true, meta: { title: 'metaspan.io - kusama pool' } },
      { path: 'selector', name: 'PolkadotsSelector', component: ValidatorsSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'selector/:stash', name: 'KusamaSelector', component: ValidatorSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'identity', name: 'KusamaIdentities', component: Identities, meta: { title: 'metaspan.io - identity' }, props: true },
      // { path: 'network', name: 'KusamaNetwork', component: Network, meta: { title: 'metaspan.io - network' }, props: true }
    ]
  },
  {
    path: '/polkadot',
    name: 'PolkadotHome',
    component: ChainHome,
    props: { chainId: 'polkadot' },
    children: [
      { path: 'candidate', name: 'PolkadotCandidates', component: Candidates, meta: { title: 'metaspan.io - 1kv' }, props: { chain: 'polkadot' } },
      { path: 'candidate/:stash', name: 'PolkadotCandidate', component: Candidate, props: true, meta: { title: 'metaspan.io - polkadot 1kv' } },
      { path: 'pool', name: 'PolkadotPools', component: Pools, meta: { title: 'metaspan.io - pools' }, props: true },
      // { path: 'pool/:id', name: 'PolkadotPool', component: Pool, props (route) { return { id: parseInt(route.params.id) } }, meta: { title: 'metaspan.io - polkadot pool' } },
      { path: 'pool/:id', name: 'PolkadotPool', component: Pool, props: true, meta: { title: 'metaspan.io - polkadot pool' } },
      { path: 'selector', name: 'PolkadotSelector', component: ValidatorSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'identity', name: 'PolkadotIdentities', component: Identities, meta: { title: 'metaspan.io - identity' }, props: true }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  // https://router.vuejs.org/guide/advanced/scroll-behavior.html
  scrollBehavior (to, from, savedPosition) {
    // console.debug('router/index.ts: scrollBehaviour', to, from, savedPosition)
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// TODO move this to a plugin?
const plausible = Plausible(store.getters['plausible/options'])
plausible.enableAutoPageviews();

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  // document.title = to.meta?.title || 'baseTitle'
  // const plausible = inject<typeof p>('$plausible') //|| new PlausiblePlugin()
  if (plausible) {
    plausible.trackPageview({
      url: to.path
    })
  }
  return next()
})

export default router
