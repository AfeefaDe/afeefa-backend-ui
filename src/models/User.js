import BaseModel from './base/BaseModel'

export default class User extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'users'
    this.name = ''
    this.area = ''
    this.organization = ''
  }

  deserialize (json) {
    this.id = json.id
    this.name = json.attributes.forename + ' ' + json.attributes.surname
    this.area = json.attributes.area
    this.organization = json.attributes.organization
  }
}
