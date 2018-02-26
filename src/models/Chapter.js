import Model from './base/Model'
import DataTypes from './base/DataTypes'
import LoadingState from '@/store/api/LoadingState'

export default class Chapter extends Model {
  static type = 'chapters'

  static query (Chapters) {
    return Chapters
  }

  static attributes () {
    return {
      title: DataTypes.String,
      content: DataTypes.String,
      order: DataTypes.Int
    }
  }

  calculateLoadingStateFromJson (json) {
    return LoadingState.FULLY_LOADED
  }

  normalizeJson (json) {
    let {title, content, order} = json
    return {
      id: json.id,
      attributes: {title, content, order}
    }
  }

  serialize () {
    let data = {
      title: this.title,
      content: this.content,
      order: this.order
    }
    if (this.id) {
      data['id'] = this.id
    }
    return data
  }
}
