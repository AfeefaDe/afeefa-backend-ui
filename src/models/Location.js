import BaseModel from './base/BaseModel'

export default class Location extends BaseModel {
  init () {
    this.id = null
    this.type = 'locations'
    this.lat = ''
    this.lon = ''
    this.street = ''
    this.number = ''
    this.zip = ''
    this.city = ''
    this.placename = ''
  }

  deserialize (json) {
    this.id = json.id
    this.lat = json.attributes.lat
    this.lon = json.attributes.lon
    this.street = json.attributes.street
    this.number = json.attributes.number
    this.zip = json.attributes.zip
    this.city = json.attributes.city
    this.placename = json.attributes.placename
  }

  serialize () {
    const data = {
      type: this.type,
      attributes: {
        lat: this.lat,
        lon: this.lon,
        street: this.street,
        number: this.number,
        zip: this.zip,
        city: this.city,
        placename: this.placename
      }
    }
    if (this.id) {
      data.id = this.id
    }
    return data
  }
}
