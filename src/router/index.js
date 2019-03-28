import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'

Vue.use(Router)

const indexPage = {
  path: '/',
  name: 'index',
  component: Index,
}

const notFoundPage = {
  path: '*',
  name: 'page404',
  component: () => import(/* webpackChunkName: "not-found" */ '@/views/errors/NotFound'),
}

/**
 * 普通路由全部放这里
 *
 * @type {*[]}
 */
const routes = [
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
    indexPage,
    {
      path: '',
      component: () => import(/* webpackChunkName: "layout" */ '@/components/Layout'),
      children: [
        ...routes,
        notFoundPage,
      ],
    },
  ],
})
