import ContactPerson from '@/models/ContactPerson'
import Location from '@/models/Location'
import ContactOwnerResource from '@/resources/relations/ContactOwner'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class Contact extends Model {
  static type = 'contacts'

  static ResourceUrl = 'contacts{/id}'

  static attributes () {
    return {
      title: DataTypes.String,

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
      },

      location_spec: DataTypes.String
    }
  }

  static relations () {
    return {
      owner: {
        type: Relation.HAS_ONE,
        Resource: ContactOwnerResource
      },

      location: {
        type: Relation.HAS_ONE,
        Model: Location
      },

      contact_persons: {
        type: Relation.HAS_MANY,
        Model: ContactPerson
      }
    }
  }

  serialize () {
    const data = {
      title: this.title,
      opening_hours: this.openingHours,
      web: this.web,
      social_media: this.socialMedia,
      spoken_languages: this.spokenLanguages,
      location_spec: this.location_spec
    }

    if (this.location) {
      if (this.location.contact_id === this.id) {
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
    return !this.openingHours && !this.web && !this.socialMedia && !this.spokenLanguages && !hasPerson
  }

  get info () {
    const location = this.location ? this.location.info : `[Location] id="${this.$rels.location.id}"`
    return super.info + ` title="${this.title}"` + `\n\t${location}`
  }
}

export default Registry.add(Contact)
