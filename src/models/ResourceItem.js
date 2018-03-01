import ResourceItems from '@/resources/ResourceItems'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class ResourceItem extends Model {
  static type = 'resource_items'

  static query = ResourceItems

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
      id: this.id,
      attributes: {
        title: this.title,
        description: this.description,
        tags: this.category
      }
    }
    // in case we are creating a new resource strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }
}
