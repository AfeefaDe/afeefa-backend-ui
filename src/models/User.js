import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class User extends Model {
  static type = 'users'

  static query (Users) {
    return Users
  }

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

      area: DataTypes.String,

      organization: DataTypes.String
    }
  }

  init () {
    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type,
      attributes: {
        forename: this.first_name,
        surname: this.last_name,
        organization: this.organization
      }
    }
    if (this.password) {
      data.attributes.password = this.password
    }
    return data
  }
}
