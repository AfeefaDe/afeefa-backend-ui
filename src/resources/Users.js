import User from '@/models/User'
import store from '@/store'
import { BASE } from '@/store/api'
import resourceCache from 'data/cache/ResourceCache'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class UsersResource extends Resource {
  init () {
    this.url = 'users{/id}'
    this.http = Vue.resource(BASE + this.url, {}, {update: {method: 'PATCH'}})
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
