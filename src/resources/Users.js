import store from '@/store'
import resourceCache from 'uidata/cache/ResourceCache'
import Resource from 'uidata/resource/Resource'

export default class UsersResource extends Resource {
  url = 'users{/id}'

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
