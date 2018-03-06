import User from '@/models/User'
import store from '@/store'
import resourceCache from 'uidata/cache/ResourceCache'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

class UsersResource extends Resource {
  init () {
    this.url = 'users{/id}'
    this.Model = User
  }

  transformJsonBeforeSave (json) {
    return {
      data: json
    }
  }
}

class Users extends Query {
  getResource () {
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
