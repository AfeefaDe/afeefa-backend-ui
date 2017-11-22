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
  get _resourceCache () {
    return store.state.api.resourceCache
  },

  // current user is not delivered by api but by auth service
  // and must hence be added manually
  setCurrentUser (user, id) {
    this._resourceCache.addItem('users', user)
  },

  removeCurrentUser (id) {
    this._resourceCache.purgeItem('users', id)
  },

  getCurrentUser () {
    return this._resourceCache.getItem('users', store.state.auth.currentUserId)
  },

  save (user) {
    return store.dispatch('api/saveItem', {
      resource: new UsersResource(),
      item: user
    })
  }
}
