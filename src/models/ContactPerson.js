import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class ContactPerson extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.attr('name', DataTypes.String)
    this.attr('role', DataTypes.String)
    this.attr('mail', DataTypes.String)
    this.attr('phone', DataTypes.String)
  }

  deserialize (json) {
    this.deserializeAttributes(json.attributes)
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
