import Annotation from '@/models/Annotation'
import Category from '@/models/Category'
import Contact from '@/models/Contact'
import FacetItem from '@/models/FacetItem'
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

      inheritance: {
        type: DataTypes.Custom,
        default: {},
        value (value) {
          const inheritance = {}
          if (value) {
            value.split('|').forEach(key => {
              inheritance[key] = true
            })
          }
          return inheritance
        }
      },

      active: DataTypes.Boolean,

      created_at: DataTypes.Date,

      updated_at: DataTypes.Date,

      state_changed_at: DataTypes.Date
    }
  }

  static relations () {
    return {
      category: {
        type: Relation.HAS_ONE,
        Model: Category
      },

      sub_category: {
        type: Relation.HAS_ONE,
        Model: Category
      },

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

    const inheritance = Object.keys(this.inheritance).filter(key => {
      return this.inheritance[key] === true
    }).join('|') || null

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
        tags: this.tags,
        inheritance: inheritance
      },
      relationships: {
        category: this.category
          ? { data: this.category.serialize() }
          : null,
        sub_category: this.sub_category
          ? { data: this.sub_category.serialize() }
          : null,
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
