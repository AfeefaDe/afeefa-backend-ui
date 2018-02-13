import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class ContactPerson extends Model {
  static attributes = {
    name: DataTypes.String,
    role: DataTypes.String,
    mail: DataTypes.String,
    phone: DataTypes.String
  }

  init () {
    this.type = 'contact_persons'

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  serialize () {
    const data = {
      name: this.name,
      role: this.role,
      mail: this.mail,
      phone: this.phone
    }
    return data
  }

  isEmpty () {
    return !this.name && !this.role && !this.mail && !this.phone
  }
}
