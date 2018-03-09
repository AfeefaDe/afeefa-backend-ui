import FacetsResource from '@/resources/Facets'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import FacetItem from './FacetItem'

class Facet extends Model {
  static type = 'facets'

  static Resource = FacetsResource

  static attributes () {
    return {
      title: DataTypes.String
    }
  }

  static relations () {
    return {
      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem
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

export default Registry.add(Facet)
