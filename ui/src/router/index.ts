import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'

import KusamaHome from '@/components/kusama/KusamaHome.vue'

import Validators from '@/components/Validators.vue'
import Nominators from '@/components/Nominators.vue'
import Candidates from '@/components/Candidates.vue'
import Candidate from '@/components/Candidate.vue'
import Docs from '@/components/Docs.vue'

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
    component: KusamaHome,
    children: [
      { path: 'pool', name: 'Pools', component: ComingSoon, meta: { title: 'metaspan.io - kusama pools' } },
      { path: 'validator', name: 'Validators', component: Validators },
      { path: 'validator/:stash', name: 'Validator', component: ComingSoon, props: true },
      { path: 'nominator', name: 'Nominators', component: Nominators },
      { path: 'candidate', name: 'Candidates', component: Candidates, meta: { title: 'metaspan.io - kusama 1kv' } },
      { path: 'candidate/:stash', name: 'Candidate', component: Candidate, props: true, meta: { title: 'metaspan.io - kusama 1kv' } }
    ]
  },
  { path: '/polkadot', name: 'PolkadotHome', component: ComingSoon },
  // {
  //   path: '/nominator',
  //   name: 'Nominators',
  //   component: Nominators
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
  return next()
})

export default router
