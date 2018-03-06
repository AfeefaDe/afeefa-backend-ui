import Chapters from '@/resources/Chapters'
import LoadingState from 'data/api/LoadingState'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class Chapter extends Model {
  static type = 'chapters'

  static Query = Chapters

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
