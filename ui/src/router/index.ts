import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import Validators from '@/components/Validators.vue'
import Nominators from '@/components/Nominators.vue'
import Candidates from '@/components/Candidates.vue'
import Candidate from '@/components/Candidate.vue'
import Docs from '@/components/Docs.vue'

Vue.use(VueRouter)

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
    path: '/nominator',
    name: 'Nominators',
    component: Nominators
  },
  {
    path: '/validator',
    name: 'Validators',
    component: Validators
  },
  {
    path: '/candidate',
    name: 'Candidates',
    component: Candidates
  },
  {
    path: '/candidate/:stash',
    name: 'Candidate',
    component: Candidate
  },
  {
    path: '/docs',
    name: 'Docs',
    component: Docs
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
