import { getToken, removeToken, setToken } from '@/libs/token'
import { login, getInfo, logout } from '@/api/auth'
import utils from '@/libs/utils'
import router from '@/router'

export default {
  state: {
    token: getToken(),
    name: '',
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
    },

    SET_NAME(state, name) {
      state.name = name
    },
  },

  actions: {
    async login({ commit }, payload) {
      const { data } = await login(payload)
      setToken(data.token)
      commit('SET_TOKEN', data.token)
    },

    async getInfo({ commit }) {
      const { data } = await getInfo()
      commit('SET_NAME', data.name)
    },

    frontendLogout({ dispatch }) {
      dispatch('clearAuth')
      removeToken()
    },

    async logout({ dispatch }) {
      await logout()
      dispatch('clearAuth')
      removeToken()
      if (utils.needAuth(router.currentRoute)) {
        router.push({
          name: 'index',
        })
      }
    },

    clearAuth({ commit }) {
      commit('SET_NAME', '')
      commit('SET_TOKEN', '')
    },
  },
}
