import Facet from '@/models/Facet'
import FacetItemOwnersResource from '@/resources/relations/FacetItemOwners'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class FacetItem extends Model {
  static type = 'facet_items'

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String,

      count_owners: DataTypes.Int
    }
  }

  static relations () {
    return {
      sub_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem
      },

      parent: {
        type: Relation.HAS_ONE,
        Model: FacetItem
      },

      facet: {
        type: Relation.HAS_ONE,
        Model: Facet
      },

      owners: {
        type: Relation.HAS_MANY,
        Resource: FacetItemOwnersResource
      }
    }
  }

  static create (facet, parent) {
    const facetItem = new FacetItem()
    facetItem.facet = facet
    facetItem.$rels.facet.id = facet.id
    if (parent) {
      facetItem.parent = parent
      facetItem.$rels.parent.id = parent.id
    }
    return facetItem
  }

  constructor () {
    super()

    this.new_facet_id = null
    this.previewColor = null
  }

  get container () {
    return this.facet
  }

  serialize () {
    const data = {
      title: this.title,
      color: this.color,
      parent_id: this.parent ? this.parent.id : null
    }

    if (this.id) {
      // move around, need to prefix facet_id since
      // it's already used as api controller param
      data.new_facet_id = this.facet.id
    }

    return data
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(FacetItem)
