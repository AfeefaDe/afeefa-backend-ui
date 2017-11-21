import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import User from '@/models/User'
import BaseResource from './base/BaseResource'

class UsersResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'users{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'users'
  }

  createItem () {
    return new User()
  }
}

export default {
  getCurrentUser () {
    return store.state.auth.currentUser
  },
  save (user) {
    // workaround, since the current user is not loaded via api
    // and hence not added to cache -> we add it here ...
    const resourceCache = store.state.api.resourceCache
    resourceCache.addItem('users', user)

    return store.dispatch('api/saveItem', {
      resource: new UsersResource(),
      item: user
    }).then(user => {
      // ... and we override the auth user
      store.commit('auth/setCurrentUser', user)
    })
  }
}
