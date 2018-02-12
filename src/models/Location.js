import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Location extends Model {
  static attributes = {
    title: DataTypes.String,
    street: DataTypes.String,
    zip: DataTypes.String,
    city: DataTypes.String,
    lat: DataTypes.String,
    lon: DataTypes.String,
    directions: DataTypes.String
  }

  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'locations'

    this.ownerTitle = ''
    this.creatingContactId = null
  }

  deserialize (json) {
    this.init()

    this.id = json.id

    this.deserializeAttributes(json.attributes)

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
    return super.info + ` title="${this.title}" street="${this.street}"`
  }
}
