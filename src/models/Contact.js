import store from '@/store'
import Model from './base/Model'
import Relation from './base/Relation'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Contact extends Model {
  static attributes = {
    title: DataTypes.String,

    fax: DataTypes.String,

    openingHours: {
      type: DataTypes.String,
      remoteName: 'opening_hours'
    },

    web: DataTypes.String,

    socialMedia: {
      type: DataTypes.String,
      remoteName: 'social_media'
    },

    spokenLanguages: {
      type: DataTypes.String,
      remoteName: 'spoken_languages'
    }
  }

  static relations = {
    location: {
      type: Relation.HAS_ONE,
      cacheKey: 'locations',
      Model: 'Location',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    },

    contact_persons: {
      type: Relation.HAS_MANY,
      cacheKey: 'contact_persons',
      cacheParams: owner => ({owner_type: owner.type, owner_id: owner.id}),
      Model: 'ContactPerson',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    }
  }

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'contacts'
  }

  fetchLocation (clone) {
    this.relation('location').fetch(id => {
      return this.Resource('Locations').get(id).then(location => {
        this.location = clone ? location.clone() : location
        return location
      })
    })
  }

  fetchContactPersons (clone) {
    const resourceCache = store.state.api.resourceCache
    this.contact_persons = []
    const contactPersons = resourceCache.getList('contact_persons', JSON.stringify({owner_type: this.type, owner_id: this.id}))
    contactPersons.forEach(person => {
      person = clone ? person.clone() : person
      this.contact_persons.push(person)
    })
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  getRelationsFromJson (json) {
    return json.relationships
  }

  afterDeserialize () {
    this.fetchLocation()
    this.fetchContactPersons()
  }

  serialize () {
    const data = {
      title: this.title,
      fax: this.fax,
      opening_hours: this.openingHours,
      web: this.web,
      social_media: this.socialMedia,
      spoken_languages: this.spokenLanguages
    }

    if (this.location) {
      if (this.location.creatingContactId === this.id) {
        // post own location data
        data.location = this.location.serialize()
      } else {
        // link to any other location
        data.location_id = this.location.id
      }
    } else {
      // remove location
      data.location_id = null
    }

    data.contact_persons = []
    for (let person of this.contact_persons) {
      data.contact_persons.push(person.serialize())
    }

    return data
  }

  clone () {
    const clone = super.clone(this)
    clone.fetchContactPersons(true)
    clone.fetchLocation(true)
    return clone
  }

  isEmpty () {
    const hasPerson = this.persons.some(cp => !cp.isEmpty())
    return !this.fax && !this.openingHours && !this.web && !this.socialMedia && !this.spokenLanguages && !hasPerson
  }

  get info () {
    const location = this.location ? this.location.info : `[Location] id="${this.relation('location').id}"`
    return super.info + ` title="${this.title}"` + `\n\t${location}`
  }
}
