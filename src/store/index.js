import { createStore } from 'vuex'

const store = createStore ({
  state: {
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    setAuthentication(state, status) {
      state.isAuthenticated = status
    },
    setUser(state, user) {
      state.user = user
    }
  },
  actions: {
    login({ commit }, user) {
      commit('setAuthentication', true)
      commit('setUser', user)
    },
    logout({ commit }) {
      commit('setAuthentication', false)
      commit('setUser', null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user
  }
})

export default function createStoreInstance () {
  return store
}

