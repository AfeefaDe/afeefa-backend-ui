import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth.js'
import api from './api.js'
import navigation from './navigation.js'
import messages from './messages.js'
import facetFilters from './facet-filters.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    api,
    navigation,
    messages,
    facetFilters
  },

  actions: {
    initApp ({dispatch}) {
      dispatch('auth/initApp')
      dispatch('navigation/initApp')
      dispatch('api/initApp')
    }
  }
})
