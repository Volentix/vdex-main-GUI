import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4451cb93 = () => interopDefault(import('../pages/trade/_id/index.vue' /* webpackChunkName: "pages/trade/_id/index" */))
const _6b8b4e53 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/trade/:id?",
    component: _4451cb93,
    name: "trade-id"
  }, {
    path: "/",
    component: _6b8b4e53,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
