import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home.vue'

Vue.use(Router)

const page404Route = {
  path: '*',
  name: 'page404',
  component: () => import(/* webpackChunkName: "404" */ '@/views/errors/404'),
}

/**
 * 普通路由全部放这里
 *
 * @type {*[]}
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About'),
  },
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    ...routes,
    page404Route,
  ],
})
