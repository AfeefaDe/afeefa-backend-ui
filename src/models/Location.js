import BaseModel from './base/BaseModel'
import Orga from './Orga'

export default class Location extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'locations'
    this.title = ''
    this.street = ''
    this.zip = ''
    this.city = ''
    this.lat = ''
    this.lon = ''
    this.directions = ''

    this.owner = null
  }

  // TODO remove again
  get ownerTitle () {
    return (this.owner && this.owner.title) || ''
  }

  deserialize (json) {
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
      const owner = new Orga()
      owner.deserialize(rels.owner.data)
      this.owner = owner
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
    if (this.id) {
      data.id = this.id
    }
    return data
  }

  clone () {
    const clone = super.clone(this)
    clone.owner = this.owner ? this.owner.clone() : null
    return clone
  }

  isEmpty () {
    return !this.street && !this.zip && !this.city && !this.title && !this.directions
  }
}
