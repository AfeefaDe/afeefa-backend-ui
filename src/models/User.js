import UsersResource from '@/resources/Users'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class User extends Model {
  static type = 'users'

  static Resource = UsersResource

  static attributes () {
    return {
      first_name: {
        type: DataTypes.String,
        remoteName: 'forename'
      },

      last_name: {
        type: DataTypes.String,
        remoteName: 'surname'
      },

      email: DataTypes.String,

      area: DataTypes.String,

      organization: DataTypes.String,

      available_areas: DataTypes.Array
    }
  }

  init () {
    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }

  get hasMulitpleAreas () {
    return this.available_areas && this.available_areas.length > 1
  }

  attributesToJson (attributes) {
    return {
      data: super.attributesToJson(attributes)
    }
  }
  isAdmin () {
    return (this.email.indexOf('@afeefa.de') > 0)
  }

  toJson () {
    return {
      data: this.serialize()
    }
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {
        area: this.area,
        forename: this.first_name,
        surname: this.last_name,
        organization: this.organization,
        available_areas: this.available_areas
      }
    }
    if (this.password) {
      data.attributes.password = this.password
    }
    return data
  }
}

export default Registry.add(User)
