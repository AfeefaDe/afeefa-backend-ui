import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class User extends Model {
  static query (Users) {
    return Users
  }

  static attributes = {
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

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'users'

    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }

  getAttributesFromJson (json) {
    return json.attributes
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
