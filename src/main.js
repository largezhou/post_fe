import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/components'
import '@/styles/index.scss'
import '@/libs/globals'
import utils from '@/libs/utils'
import '@/mocks'

Vue.config.productionTip = false

/**
 * @see utils.snackbar
 */
Vue.prototype.$snackbar = utils.snackbar

Vue.prototype.$bus = new Vue()

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

if (process.env.NODE_ENV == 'development') {
  window.app = app
  window.Vue = Vue
  window.utils = utils
}
