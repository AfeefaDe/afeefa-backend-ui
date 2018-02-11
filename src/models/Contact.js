import Model from './base/Model'
import Relation from './base/Relation'
import ContactPerson from './ContactPerson'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Contact extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'contacts'

    this.attr('title', DataTypes.String)
    this.attr('fax', DataTypes.String)
    this.attr('openingHours', DataTypes.String, {
      remoteName: 'opening_hours'
    })
    this.attr('web', DataTypes.String)
    this.attr('socialMedia', DataTypes.String, {
      remoteName: 'social_media'
    })
    this.attr('spokenLanguages', DataTypes.String, {
      remoteName: 'spoken_languages'
    })

    this.location = null
    this.persons = []
  }

  locationRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'locations',
      Model: this.Model('Location')
    })
  }

  fetchLocation (clone) {
    this.relation('location').fetch(id => {
      return this.Resource('Locations').get(id).then(location => {
        this.location = clone ? location.clone() : location
        return location
      })
    })
  }

  deserialize (json) {
    this.init()

    this.id = json.id

    this.deserializeAttributes(json.attributes)

    const rels = json.relationships || {}

    // location
    if (rels.location && rels.location.data) {
      this.relation('location').initWithJson(rels.location.data)
    }

    // contact persons
    if (rels.contact_persons && rels.contact_persons.data.length) {
      for (let jsonPerson of rels.contact_persons.data) {
        const person = new ContactPerson()
        person.deserialize(jsonPerson)
        this.persons.push(person)
      }
    }
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
    for (let person of this.persons) {
      data.contact_persons.push(person.serialize())
    }

    return data
  }

  clone () {
    const clone = super.clone(this)
    // persons
    clone.persons = this.persons.map(cp => cp.clone())
    // location
    clone.fetchLocation(true)
    return clone
  }

  isEmpty () {
    const hasPerson = this.persons.some(cp => !cp.isEmpty())
    return !this.fax && !this.openingHours && !this.web && !this.socialMedia && !this.spokenLanguages && !hasPerson
  }

  get info () {
    const location = this.location ? this.location.info : `[Locations id="${this.relation('location').id}"]`
    return `[Contacts id=${this.id} ID=${this._ID} title="${this.title}" clone="${this._isClone}"]` +
      `\n\t${location}`
  }
}
