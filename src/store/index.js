import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import api from './api'
import navigation from './navigation'
import messages from './messages'
import entryListFilters from './entry-list-filters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    api,
    navigation,
    messages,
    entryListFilters
  },

  actions: {
    initApp ({dispatch}) {
      dispatch('auth/initApp')
      dispatch('navigation/initApp')
      dispatch('api/initApp')
    }
  }
})
