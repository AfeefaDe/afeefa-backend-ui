import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Chapter extends Model {
  static query (Chapters) {
    return Chapters
  }

  static attributes = {
    title: DataTypes.String,
    content: DataTypes.String,
    order: DataTypes.Int
  }

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'chapters'
  }

  getAttributesFromJson (json) {
    return json.attributes
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
