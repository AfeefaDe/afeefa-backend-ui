import ContactPerson from '@/models/ContactPerson'
import Location from '@/models/Location'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

export default class Contact extends Model {
  static type = 'contacts'

  static attributes () {
    return {
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
  }

  static relations () {
    return {
      location: {
        type: Relation.HAS_ONE,
        associationType: Relation.ASSOCIATION_COMPOSITION,
        Model: Location
      },

      contact_persons: {
        type: Relation.HAS_MANY,
        associationType: Relation.ASSOCIATION_COMPOSITION,
        Model: ContactPerson
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
    for (let person of this.contact_persons) {
      data.contact_persons.push(person.serialize())
    }

    return data
  }

  isEmpty () {
    const hasPerson = this.persons.some(cp => !cp.isEmpty())
    return !this.fax && !this.openingHours && !this.web && !this.socialMedia && !this.spokenLanguages && !hasPerson
  }

  get info () {
    const location = this.location ? this.location.info : `[Location] id="${this.$rels.location.id}"`
    return super.info + ` title="${this.title}"` + `\n\t${location}`
  }
}
