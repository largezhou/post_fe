import Snackbar from '@/components/modals/Snackbar'
import store from '@/store'

const utils = {}

export default utils

utils.snackbar = (msg) => {
  return new Promise((resolve) => {
    const callback = () => {
      resolve()
    }

    const ins = new Snackbar({
      propsData: {
        callback,
        text: msg,
      },
      store,
    })

    document.body.appendChild(ins.$mount().$el)
  })
}

utils.needAuth = (route) => {
  return route.matched.some(r => (r.meta && r.meta.auth))
}
