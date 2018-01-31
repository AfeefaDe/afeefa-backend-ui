import BaseModel from './base/BaseModel'
import ContactPerson from './ContactPerson'

export default class Contact extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'contacts'
    this.fax = ''
    this.openingHours = ''
    this.web = ''
    this.socialMedia = ''
    this.spokenLanguages = ''

    this.persons = []
  }

  deserialize (json) {
    this.id = json.id
    this.fax = json.attributes.fax || ''
    this.openingHours = json.attributes.opening_hours || ''
    this.web = json.attributes.web || ''
    this.socialMedia = json.attributes.social_media || ''
    this.spokenLanguages = json.attributes.spoken_languages || ''

    const rels = json.relationships || {}

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
      fax: this.fax,
      opening_hours: this.openingHours,
      web: this.web,
      social_media: this.socialMedia,
      spoken_languages: this.spokenLanguages,
      contact_persons: []
    }

    for (let person of this.persons) {
      data.contact_persons.push(person.serialize())
    }

    if (this.id) {
      data.id = this.id
    }
    return data
  }

  clone () {
    const clone = super.clone(this)

    // persons
    clone.persons = this.persons.map(cp => cp.clone())

    return clone
  }

  isEmpty () {
    const hasPerson = this.persons.some(cp => !cp.isEmpty())
    return !this.fax && !this.openingHours && !this.web && !this.socialMedia && !this.spokenLanguages && !hasPerson
  }
}
