import OfferOwnersResource from '@/resources/relations/OfferOwners'
import OwnerFacetItemsResource from '@/resources/relations/OwnerFacetItems'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import FacetItem from './FacetItem'
import Orga from './Orga'

class Offer extends Model {
  static type = 'offers'

  static ResourceUrl = 'offers{/id}'

  static attributes () {
    return {
      title: DataTypes.String,

      description: DataTypes.String
    }
  }

  static relations () {
    return {
      owners: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: OfferOwnersResource
      },

      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem,
        Resource: OwnerFacetItemsResource
      }
    }
  }

  serialize () {
    const data = {
      title: this.title,
      description: this.description
    }

    if (!this.id && this.actors.length) {
      data.actor_id = this.actors[0].id
    }
    return data
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(Offer)
