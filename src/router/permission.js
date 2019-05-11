import router from './index'
import store from '@/store'
import { getToken } from '@/libs/token'
import utils from '@/libs/utils'
import Vue from 'vue'
import axios from '@/plugins/axios'

const guestPage = 'index'
const letUsLogin = () => {
  Vue.$bus.$emit('let-me-login', () => {
    store.dispatch('getInfo')
  })
}
const shareHostWhiteList = [
  'page404Everywhere',
  'page404',
  'showShare',
]

router.beforeEach((to, from, next) => {
  const needAuth = utils.needAuth(to)
  // 如果在分享页，则把 baseUrl 设置为分享api
  if (to.name === 'showShare') {
    const baseUrl = process.env.VUE_APP_SHARE_BASE_URL
    if (!baseUrl) {
      utils.snackbar('分享没设置好啊')
      return next(false)
    }
    axios.defaults.baseURL = baseUrl
  }

  log(to.name)
  // 检查分享
  if (
    shareHostWhiteList.indexOf(to.name) === -1 &&
    location.host === process.env.VUE_APP_SHARE_HOST
  ) {
    return next({
      name: 'page404',
    })
  }

  // 本地有token，表示已登录
  if (getToken()) {
    // 已登录的情况下，访问登录页，跳转到首页
    // 否则获取用户信息
    if (to.name === 'login' || to.name === 'loginEverywhere') {
      next({ name: guestPage })
    } else {
      // 如果已有用户信息，则直接跳转
      // 否则从服务器获取用户信息
      if (store.state.user.name) {
        next()
      } else {
        store
          .dispatch('getInfo')
          .then(res => {
            // 获取用户信息成功，跳转
            log('Permission getInfo', res)
            next()
          })
          .catch(err => {
            log('permission getInfo catch', err.response)
            const res = err.response
            // 如果获取用户信息失败，且响应为未认证，则前端清除token，弹出提示 并：
            //   如果需要登录，则跳转到登录页
            //   否则直接过
            if (res && res.status === 401) {
              if (needAuth) {
                letUsLogin()
                next(false)
              } else {
                next()
              }
            }
          })
      }
    }
  } else {
    if (needAuth) {
      letUsLogin()
      next(false)
    } else {
      next()
    }
  }
})
