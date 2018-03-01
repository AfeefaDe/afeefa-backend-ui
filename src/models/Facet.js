import Facets from '@/resources/Facets'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

import FacetItem from './FacetItem'

export default class Facet extends Model {
  static type = 'facets'

  static query = Facets

  static attributes () {
    return {
      title: DataTypes.String
    }
  }

  static relations () {
    return {
      facet_items: {
        type: Relation.HAS_MANY,
        associationType: Relation.ASSOCIATION_COMPOSITION,
        Model: FacetItem
      }
    }
  }

  fetchFacetItems (FacetItem) {
    return FacetItem.forOwner(this).getAll()
  }

  serialize () {
    return {
      title: this.title
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}
