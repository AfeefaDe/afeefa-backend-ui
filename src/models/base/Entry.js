import Annotation from '@/models/Annotation'
import Contact from '@/models/Contact'
import FacetItem from '@/models/FacetItem'
import NavigationItem from '@/models/NavigationItem'
import User from '@/models/User'
import ContactsResource from '@/resources/relations/EntryContacts'
import OwnerFacetItemsResource from '@/resources/relations/OwnerFacetItems'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Relation from 'uidata/model/Relation'

export default class Entry extends Model {
  static attributes () {
    return {
      title: DataTypes.String,

      description: DataTypes.String,

      short_description: DataTypes.String,

      media_url: DataTypes.String,

      support_wanted: DataTypes.Boolean,

      support_wanted_detail: DataTypes.String,

      certified_sfr: DataTypes.Boolean,

      tags: DataTypes.String,

      facebook_id: DataTypes.String,

      active: DataTypes.Boolean,

      created_at: DataTypes.Date,

      updated_at: DataTypes.Date,

      state_changed_at: DataTypes.Date
    }
  }

  static relations () {
    return {
      contacts: {
        type: Relation.HAS_MANY,
        Model: Contact,
        Resource: ContactsResource
      },

      annotations: {
        type: Relation.HAS_MANY,
        Model: Annotation
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
        Model: NavigationItem
      }
    }
  }

  toJson () {
    return {
      data: this.serialize()
    }
  }

  serialize () {
    const annotations = []
    for (let annotation of this.annotations) {
      annotations.push(annotation.serialize())
    }

    const data = {
      type: this.type,
      attributes: {
        title: this.title,
        description: this.description,
        short_description: this.short_description,
        active: this.active,
        media_url: this.media_url,
        support_wanted: this.support_wanted,
        support_wanted_detail: this.support_wanted_detail,
        certified_sfr: this.certified_sfr,
        tags: this.tags
      },
      relationships: {
        annotations: {
          data: annotations
        }
      }
    }
    if (this.id) {
      data.id = this.id
    }
    return data
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}
