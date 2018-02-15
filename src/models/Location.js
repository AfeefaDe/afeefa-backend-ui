import Model from './base/Model'
import DataTypes from './base/DataTypes'

export default class Location extends Model {
  static type = 'locations'

  static query (Locations) {
    return Locations
  }

  static attributes () {
    return {
      title: DataTypes.String,

      street: DataTypes.String,

      zip: DataTypes.String,

      city: DataTypes.String,

      lat: DataTypes.String,

      lon: DataTypes.String,

      directions: DataTypes.String,

      ownerTitle: DataTypes.String,

      creatingContactId: DataTypes.String
    }
  }

  normalizeJson (json) {
    const attributes = json.attributes
    const rels = json.relationships || {}
    if (rels.owner && rels.owner.data) {
      attributes.ownerTitle = rels.owner.data.attributes.title
    }
    if (rels.contact && rels.contact.data) {
      attributes.creatingContactId = rels.contact.data.id
    }
    return {
      id: json.id,
      attributes
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
    return super.info + ` title="${this.title}" street="${this.street}"`
  }
}
