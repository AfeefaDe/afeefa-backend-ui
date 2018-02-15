import Model from './base/Model'
import DataTypes from './base/DataTypes'

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

  getAttributesFromJson (json) {
    return json
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
