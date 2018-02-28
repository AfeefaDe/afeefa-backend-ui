import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class Facet extends Model {
  static type = 'facets'

  static query (Facets) {
    return Facets
  }

  static attributes () {
    return {
      title: DataTypes.String
    }
  }

  serialize () {
    return {
      title: this.title
    }
  }
}
