import axios from 'axios'
import utils from '@/libs/utils'
import store from '@/store'
import { getToken } from '@/libs/token'

let config = {
  baseURL: process.env.VUE_APP_BASE_URL || '/',
  timeout: 60 * 1000,
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getToken()
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

_axios.interceptors.response.use(
  (res) => {
    log(res.config.url, res)
    return res
  },
  (err) => {
    log('err in axios response', { err })
    const res = err.response

    if (res) {
      switch (res.status) {
        case 404:
          utils.snackbar('请求的网址的不存在')
          break
        case 401:
          store.dispatch('frontendLogout')
          utils.snackbar('登录已失效')
          break
        default:
          utils.snackbar(`服务器错误 (code: ${res.status})`)
      }
    } else {
      utils.snackbar('请求错误')
    }
    return Promise.reject(err)
  },
)

export default _axios
