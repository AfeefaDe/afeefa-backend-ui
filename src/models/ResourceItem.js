import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class ResourceItem extends Model {
  static query (ResourceItems) {
    return ResourceItems
  }

  static attributes = {
    title: DataTypes.String,
    description: DataTypes.String,
    category: DataTypes.String,
    created_at: DataTypes.Date,
    updated_at: DataTypes.Date
  }

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'resource_items'
  }

  getAttributesFromJson (json) {
    return json.attributes
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
