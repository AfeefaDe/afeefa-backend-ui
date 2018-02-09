import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'

export default class ContactPerson extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.name = ''
    this.role = ''
    this.mail = ''
    this.phone = ''
  }

  deserialize (json) {
    this.name = json.attributes.name || ''
    this.role = json.attributes.role || ''
    this.mail = json.attributes.mail || ''
    this.phone = json.attributes.phone || ''
  }

  serialize () {
    const data = {
      name: this.name,
      role: this.role,
      mail: this.mail,
      phone: this.phone
    }
    return data
  }

  isEmpty () {
    return !this.name && !this.role && !this.mail && !this.phone
  }
}
