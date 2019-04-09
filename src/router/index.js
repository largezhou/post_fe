import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'

Vue.use(Router)

const indexPage = {
  path: '/',
  name: 'index',
  meta: {
    keepAlive: true,
  },
  component: Index,
}

const notFoundPage = {
  path: '*',
  name: 'page404',
  component: () => import(/* webpackChunkName: "not-found" */ '@/views/errors/NotFound'),
}

// 登录
const login = {
  path: '/login',
  name: 'login',
  component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
}

// 任何路径后面加一个/login，即可跳转到登录页
const loginEverywhere = {
  path: '*/login',
  name: 'loginEverywhere',
  component: () => import(/* webpackChunkName: "login" */ '@/views/Login'),
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
  {
    path: '/admin',
    name: 'adminIndex',
    meta: {
      auth: true,
    },
    component: () => import(/* webpackChunkName: "admin-index" */ '@/views/admin/Index'),
  },
  {
    // 标签内容不能全为空
    path: '/tags/:tagName(\\s*\\S.*)/posts',
    name: 'showTagPosts',
    component: () => import(/* webpackChunkName: "show-tag-posts" */ '@/views/TagPosts'),
  },
]

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior(to, from, savedPosition) {
    // savedPosition 为 null 表示页面是跳转的，而不是历史记录中`前进`或`后退`
    return savedPosition || { x: 0, y: 0 }
  },
  routes: [
    indexPage,
    {
      path: '',
      component: () => import(/* webpackChunkName: "layout" */ '@/components/Layout'),
      children: [
        login,
        ...routes,
        loginEverywhere,
        notFoundPage,
      ],
    },
  ],
})
