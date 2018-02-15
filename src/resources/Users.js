import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import User from '@/models/User'
import Resource from './base/Resource'

class UsersResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'users{/id}', {}, {update: {method: 'PATCH'}})
    this.listType = 'users'
  }

  getItemModel () {
    return User
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

  get (id) {
    return Promise.resolve(this._resourceCache.getItem('users', id))
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
