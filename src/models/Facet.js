import FacetsResource from '@/resources/Facets'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'
import FacetFacetItemsResource from '@/resources/relations/FacetFacetItems'

import FacetItem from './FacetItem'

class Facet extends Model {
  static type = 'facets'

  static Resource = FacetsResource

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String,

      color_sub_items: DataTypes.Boolean
    }
  }

  static relations () {
    return {
      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem,
        Resource: FacetFacetItemsResource
      }
    }
  }

  constructor () {
    super()

    this.previewColor = null
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

  findFacetItem (facetItemId) {
    for (const facetItem of this.facet_items) {
      if (facetItem.id === facetItemId) {
        return facetItem
      }
      for (const subFacetItem of facetItem.sub_items) {
        if (subFacetItem.id === facetItemId) {
          return subFacetItem
        }
      }
    }
    return null
  }
}

export default Registry.add(Facet)
