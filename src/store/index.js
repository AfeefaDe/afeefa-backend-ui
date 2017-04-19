import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js'
import api from './api.js'
import navigation from './navigation.js'
import messages from './messages.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    api,
    navigation,
    messages
  },

  actions: {
    initApp ({dispatch}) {
      dispatch('auth/initApp')
      dispatch('navigation/initApp')
      dispatch('api/initApp')
    }
  }
})
