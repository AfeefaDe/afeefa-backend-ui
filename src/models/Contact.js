import BaseModel from './base/BaseModel'

export default class Contact extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'contacts'
    this.person = ''
    this.mail = ''
    this.phone = ''
    this.openingHours = ''
    this.web = ''
    this.socialMedia = ''
  }

  deserialize (json) {
    this.id = json.id
    this.person = json.attributes.contact_person || ''
    this.mail = json.attributes.mail || ''
    this.phone = json.attributes.phone || ''
    this.openingHours = json.attributes.opening_hours || ''
    this.web = json.attributes.web || ''
    this.socialMedia = json.attributes.social_media || ''
  }

  serialize () {
    const data = {
      type: 'contact_infos',
      attributes: {
        contact_person: this.person,
        mail: this.mail,
        phone: this.phone,
        opening_hours: this.openingHours,
        web: this.web,
        social_media: this.socialMedia
      }
    }
    if (this.id) {
      data.id = this.id
    }
    return data
  }

  isEmpty () {
    return !this.person && !this.mail && !this.phone && !this.openingHours && !this.web && !this.socialMedia
  }
}
