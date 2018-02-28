import User from '@/models/User'
import store from '@/store'
import { BASE } from '@/store/api'
import resourceCache from 'data/cache/ResourceCache'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

import Query from './base/Query'

class UsersResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'users{/id}', {}, {update: {method: 'PATCH'}})
  }

  getItemModel () {
    return User
  }
}

class Users extends Query {
  getApi () {
    return ['setCurrentUser', 'removeCurrentUser', 'get', 'getCurrentUser', 'save']
  }

  createResource () {
    return new UsersResource()
  }

  // current user is not delivered by api but by auth service
  // and must hence be added manually
  setCurrentUser (user, id) {
    resourceCache.addItem('users', user)
  }

  removeCurrentUser (id) {
    resourceCache.purgeItem('users', id)
  }

  getCurrentUser () {
    return resourceCache.getItem('users', store.state.auth.currentUserId)
  }
}

export default new Users()
