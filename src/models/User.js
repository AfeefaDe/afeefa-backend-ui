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

      available_areas: DataTypes.String
    }
  }

  init () {
    this.password = ''
  }

  get name () {
    return this.first_name + ' ' + this.last_name
  }
  /*
   * this function is connected to the commit 950ec96d69e of the backend-api: https://github.com/AfeefaDe/afeefa-backend-api/commit/950ec96d69e10191bfadc8d2e859e6a3822ca1dc
   * cause the column type is string, I'm unable to use `DataTypes.Array`. So the parsing is done in the temporary get multipleAreas method. This getter should be removed after the right column data type is set in the api
   */
  get multipleAreas () {
    let areas = JSON.parse(this.available_areas)
    return areas
  }

  get hasMulitpleAreas () {
    let areas = JSON.parse(this.available_areas)
    return areas && areas.length > 1
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
