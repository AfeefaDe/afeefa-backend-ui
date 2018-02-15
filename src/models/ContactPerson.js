import Model from './base/Model'
import DataTypes from './base/DataTypes'

export default class ContactPerson extends Model {
  static type = 'contact_persons'

  static attributes () {
    return {
      name: DataTypes.String,
      role: DataTypes.String,
      mail: DataTypes.String,
      phone: DataTypes.String
    }
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
