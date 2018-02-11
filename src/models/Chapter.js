import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Chapter extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'chapters'

    this.attr('title', DataTypes.String)
    this.attr('content', DataTypes.String)
    this.attr('order', DataTypes.Int)
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)
  }

  serialize () {
    let data = {
      id: this.id,
      title: this.title,
      content: this.content,
      order: this.order
    }
    // in case we are creating a new resource strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }
}
