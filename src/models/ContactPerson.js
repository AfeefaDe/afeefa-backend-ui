import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

class ContactPerson extends Model {
  static type = 'contact_persons'

  static attributes () {
    return {
      name: DataTypes.String,
      role: DataTypes.String,
      mail: DataTypes.String,
      phone: DataTypes.String
    }
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

export default Model.register(ContactPerson)
