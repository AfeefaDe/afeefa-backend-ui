import Orga from '@/models/Orga'
import ContactOwnerResource from '@/resources/relations/ContactOwner'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class Location extends Model {
  static type = 'locations'

  static ResourceUrl = 'locations{/id}'

  static attributes () {
    return {
      title: DataTypes.String,

      street: DataTypes.String,

      zip: DataTypes.String,

      city: DataTypes.String,

      lat: DataTypes.String,

      lon: DataTypes.String,

      directions: DataTypes.String,

      contact_id: DataTypes.String
    }
  }

  static relations () {
    return {
      owner: {
        type: Relation.HAS_ONE,
        Resource: ContactOwnerResource
      },

      linking_actors: {
        type: Relation.HAS_MANY,
        Model: Orga
      }
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

export default Registry.add(Location)
