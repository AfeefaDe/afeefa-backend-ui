import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'

export default class Location extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state

    this.id = null
    this.type = 'locations'
    this.title = ''
    this.street = ''
    this.zip = ''
    this.city = ''
    this.lat = ''
    this.lon = ''
    this.directions = ''

    this.ownerTitle = ''
    this.creatingContactId = null
  }

  deserialize (json) {
    this.init()

    this.id = json.id

    this.title = json.attributes.title || ''
    this.street = json.attributes.street || ''
    this.zip = json.attributes.zip || ''
    this.city = json.attributes.city || ''
    this.lat = json.attributes.lat || ''
    this.lon = json.attributes.lon || ''
    this.directions = json.attributes.directions || ''

    const rels = json.relationships || {}

    if (rels.owner && rels.owner.data) {
      this.ownerTitle = rels.owner.data.attributes.title
    }

    if (rels.contact && rels.contact.data) {
      this.creatingContactId = rels.contact.data.id
    }
  }

  serialize () {
    const data = {
      title: this.title,
      street: this.street,
      zip: this.zip,
      city: this.city,
      lat: this.lat || '', // if unknown, it's set to null in entry edit
      lon: this.lon || '',
      directions: this.directions
    }
    return data
  }

  isEmpty () {
    return !this.street && !this.zip && !this.city && !this.title && !this.directions
  }

  get info () {
    return `[Locations id=${this.id} ID=${this.__ID} title="${this.title}" street="${this.street}"]`
  }
}
