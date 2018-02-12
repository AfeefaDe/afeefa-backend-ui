import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class User extends Model {
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
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'users'

    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)
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
