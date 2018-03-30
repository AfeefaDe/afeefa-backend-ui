import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class ResourceItem extends Model {
  static type = 'resource_items'

  static attributes () {
    return {
      title: DataTypes.String,

      description: DataTypes.String,

      category: DataTypes.String,

      created_at: DataTypes.Date,

      updated_at: DataTypes.Date
    }
  }

  serialize () {
    let data = {
      type: this.type,
      attributes: {
        title: this.title,
        description: this.description,
        tags: this.category
      }
    }
    if (this.id) {
      data['id'] = this.id
    }
    return data
  }
}

export default Registry.add(ResourceItem)
