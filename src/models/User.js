import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'

export default class User extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state

    this.id = null
    this.type = 'users'
    this.first_name = ''
    this.last_name = ''
    this.area = ''
    this.organization = ''
    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }

  deserialize (json) {
    this.id = json.id
    this.first_name = json.attributes.forename
    this.last_name = json.attributes.surname
    this.area = json.attributes.area
    this.organization = json.attributes.organization
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {
        forename: this.first_name,
        surname: this.last_name,
        organization: this.organization
      }
    }
    if (this.password) {
      data.attributes.password = this.password
    }
    return data
  }
}
