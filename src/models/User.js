import BaseModel from './base/BaseModel'

export default class User extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'users'
    this.first_name = ''
    this.last_name = ''
    this.area = ''
    this.organization = ''
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
    return data
  }

  clone () {
    const user = new User()
    user.id = this.id
    user.first_name = this.first_name
    user.last_name = this.last_name
    user.organization = this.organization
    return user
  }
}
