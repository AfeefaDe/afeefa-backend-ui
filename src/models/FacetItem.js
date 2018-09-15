import Facet from '@/models/Facet'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class FacetItem extends Model {
  static type = 'facet_items'

  static attributes () {
    return {
      title: DataTypes.String,

      color: DataTypes.String
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

  init () {
    this.previewColor = null
    this.selectedForMoval = false
  }

  get container () {
    return this.facet
  }

  serialize () {
    return {
      title: this.title,
      color: this.color,
      parent_id: this.parent ? this.parent.id : null
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(FacetItem)
