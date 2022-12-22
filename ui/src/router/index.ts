import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'

import ChainHome from '@/components/ChainHome.vue'
// import PolkadotHome from '@/components/polkadot/PolkadotHome.vue'

import Validators from '@/components/Validators.vue'
import Nominators from '@/components/Nominators.vue'
import Candidates from '@/components/Candidates.vue'
import Candidate from '@/components/Candidate.vue'
import Pools from '@/components/Pools.vue'
import Pool from '@/components/Pool.vue'
import Docs from '@/components/Docs.vue'
import ValidatorsSelector from '@/components/ValidatorsSelector.vue'
import ValidatorSelector from '@/components/ValidatorSelector.vue'

import Identities from '@/components/Identities.vue'

import ComingSoon from '@/components/ComingSoon.vue'

Vue.use(VueRouter)

const baseTitle = 'metaspan.io'

const routes: Array<RouteConfig> = [
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
      { path: 'pool/:id', name: 'KusamaPool', component: Pool, props (route) { return { id: parseInt(route.params.id) } }, meta: { title: 'metaspan.io - kusama pool' } },
      { path: 'selector', name: 'PolkadotsSelector', component: ValidatorsSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'selector/:stash', name: 'KusamaSelector', component: ValidatorSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'identity', name: 'KusamaIdentities', component: Identities, meta: { title: 'metaspan.io - identity' }, props: true }
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
      { path: 'pool/:id', name: 'PolkadotPool', component: Pool, props (route) { return { id: parseInt(route.params.id) } }, meta: { title: 'metaspan.io - polkadot pool' } },
      { path: 'selector', name: 'PolkadotSelector', component: ValidatorSelector, meta: { title: 'metaspan.io - validator selector' }, props: true },
      { path: 'identity', name: 'PolkadotIdentities', component: Identities, meta: { title: 'metaspan.io - identity' }, props: true }
    ]
  },
  // {
  //   path: '/chain/:chain',
  //   name: 'KusamaHome',
  //   component: KusamaHome,
  //   props: true,
  //   children: [
  //     // { path: 'pool', name: 'Pools', component: ComingSoon, meta: { title: 'metaspan.io - kusama pools' } },
  //     // { path: 'validator', name: 'Validators', component: Validators },
  //     // { path: 'validator/:stash', name: 'Validator', component: ComingSoon, props: true },
  //     // { path: 'nominator', name: 'Nominators', component: Nominators },
  //     { path: 'candidate', name: 'Candidates', component: Candidates, meta: { title: 'metaspan.io - 1kv' }, props: true },
  //     { path: 'candidate/:stash', name: 'Candidate', component: Candidate, props: true, meta: { title: 'metaspan.io - kusama 1kv' } }
  //   ]
  // },
  // { path: '/polkadot', name: 'PolkadotHome', component: ComingSoon },
  // {
  //   path: '/polkadot',
  //   name: 'PolkadotHome',
  //   component: PolkadotHome,
  //   children: [
  //     // { path: 'pool', name: 'Pools', component: ComingSoon, meta: { title: 'metaspan.io - kusama pools' } },
  //     // { path: 'validator', name: 'Validators', component: Validators, props: { chain: 'polkadot' } },
  //     // { path: 'validator/:stash', name: 'PolkadotValidator', component: ComingSoon, props: true },
  //     // { path: 'nominator', name: 'Nominators', component: Nominators },
  //     {
  //       path: 'candidate',
  //       name: 'PolkadotCandidates',
  //       component: Candidates,
  //       props: { chain: 'polkadot' },
  //       meta: { title: 'metaspan.io - kusama 1kv' }
  //     },
  //     {
  //       path: 'candidate/:stash',
  //       name: 'PolkadotCandidate',
  //       component: Candidate,
  //       props: { chain: 'polkadot' },
  //       meta: { title: 'metaspan.io - kusama 1kv' }
  //     }
  //   ]
  // },
  // {
  //   path: '/validator',
  //   name: 'Validators',
  //   component: Validators,
  //   meta: { title: 'metaspan.io - validators' }
  // },
  // {
  //   path: '/candidate',
  //   name: 'Candidates',
  //   component: Candidates,
  //   meta: { title: 'metaspan.io - candidates' }
  // },
  // {
  //   path: '/candidate/:stash',
  //   name: 'Candidate',
  //   component: Candidate
  // },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs,
    meta: { title: 'metaspan.io - api docs' }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title || baseTitle
  Vue.$plausible.trackPageview({
    // apiHost: 'http://192.168.1.99:8000',
    url: to.path
  })
  return next()
})

export default router
