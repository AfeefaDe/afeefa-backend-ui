import Facets from '@/resources/Facets'
import FacetFacetItems from '@/resources/relations/FacetFacetItems'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Relation from 'uidata/model/Relation'

import FacetItem from './FacetItem'

class Facet extends Model {
  static type = 'facets'

  static Query = Facets

  static attributes () {
    return {
      title: DataTypes.String
    }
  }

  static relations () {
    return {
      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem,
        Query: FacetFacetItems
      }
    }
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

export default Model.register(Facet)
