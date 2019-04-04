import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from '@/router'
import '@/router/permission'
import store from '@/store'
import '@/components'
import '@/styles/index.scss'
import '@/libs/globals'
import utils from '@/libs/utils'
import '@/mocks'
import '@/libs/constants'
import '@/plugins/vee-validate'

Vue.config.productionTip = false

/**
 * @see utils.snackbar
 */
Vue.prototype.$snackbar = utils.snackbar

const bus = new Vue()
Vue.prototype.$bus = bus
Vue.$bus = bus

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
