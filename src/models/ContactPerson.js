import BaseModel from './base/BaseModel'

export default class ContactPerson extends BaseModel {
  init () {
    super.init()

    this._fullyLoaded = true // there is no half-loaded-state

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
