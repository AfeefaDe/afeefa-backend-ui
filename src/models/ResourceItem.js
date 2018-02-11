import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class ResourceItem extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'resource_items'

    this.attr('title', DataTypes.String)
    this.attr('description', DataTypes.String)
    this.attr('category', DataTypes.String)
    this.attr('created_at', DataTypes.Date)
    this.attr('updated_at', DataTypes.Date)
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)
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
