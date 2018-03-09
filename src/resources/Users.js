import store from '@/store'
import resourceCache from 'uidata/cache/ResourceCache'
import ModelResource from 'uidata/resource/ModelResource'

export default class UsersResource extends ModelResource {
  url = 'users{/id}'

  transformJsonBeforeSave (json) {
    return {
      data: json
    }
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
