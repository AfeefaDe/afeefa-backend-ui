import OffersResource from '@/resources/Offers'
import EntryAnnotationsResource from '@/resources/relations/EntryAnnotations'
import ContactsResource from '@/resources/relations/EntryContacts'
import OfferOwnersResource from '@/resources/relations/OfferOwners'
import OwnerFacetItemsResource from '@/resources/relations/OwnerFacetItems'
import OwnerNavigationItemsResource from '@/resources/relations/OwnerNavigationItems'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import Annotation from './Annotation'
import Contact from './Contact'
import FacetItem from './FacetItem'
import NavigationItem from './NavigationItem'
import Orga from './Orga'
import User from './User'

class Offer extends Model {
  static type = 'offers'

  static Resource = OffersResource

  static attributes () {
    return {
      title: DataTypes.String,

      short_description: DataTypes.String,

      description: DataTypes.String,

      image_url: DataTypes.String,

      contact_spec: DataTypes.String,

      active: DataTypes.Boolean,

      created_at: DataTypes.Date,

      updated_at: DataTypes.Date
    }
  }

  static relations () {
    return {
      owners: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: OfferOwnersResource,
        reverseName: 'offers'
      },

      annotations: {
        type: Relation.HAS_MANY,
        Model: Annotation,
        Resource: EntryAnnotationsResource
      },

      contacts: {
        type: Relation.HAS_MANY,
        Model: Contact,
        Resource: ContactsResource
      },

      creator: {
        type: Relation.HAS_ONE,
        Model: User
      },

      last_editor: {
        type: Relation.HAS_ONE,
        Model: User
      },

      facet_items: {
        type: Relation.HAS_MANY,
        Model: FacetItem,
        Resource: OwnerFacetItemsResource
      },

      navigation_items: {
        type: Relation.HAS_MANY,
        Model: NavigationItem,
        Resource: OwnerNavigationItemsResource
      }
    }
  }

  init () {
    this.facetOwnerType = 'Offer'
    this.convertFromActorId = null
  }

  attributesToJson (attributes) {
    return attributes
  }

  serialize () {
    const data = {
      title: this.title,
      short_description: this.short_description,
      description: this.description,
      image_url: this.image_url,
      contact_spec: this.contact_spec
    }

    if (!this.id && this.owners.length) {
      data.owners = this.owners.map(o => o.id)
    }

    if (!this.id && this.convertFromActorId) {
      data.actorId = this.convertFromActorId
    }
    return data
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Registry.add(Offer)
