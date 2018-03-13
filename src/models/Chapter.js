import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'

class Chapter extends Model {
  static type = 'chapters'

  static ResourceUrl = 'chapters{/id}'

  static attributes () {
    return {
      title: DataTypes.String,
      content: DataTypes.String,
      order: DataTypes.Int
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

export default Registry.add(Chapter)
