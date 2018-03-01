import FacetItems from '@/resources/FacetItems'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class FacetItem extends Model {
  static type = 'facet_items'

  static query = FacetItems

  static attributes () {
    return {
      title: DataTypes.String,
      color: DataTypes.String
    }
  }

  serialize () {
    return {
      title: this.title,
      color: this.color
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}
