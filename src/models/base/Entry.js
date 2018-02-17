import LoadingStrategy from '@/store/api/LoadingStrategy'
import DataTypes from './DataTypes'
import Model from './Model'
import Relation from './Relation'
import LoadingState from '@/store/api/LoadingState'

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

  static relations (Contact, Annotation, User, Category) {
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
        Model: Contact
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
      }
    }
  }

  calculateLoadingStateFromJson (json) {
    if (json.relationships && json.relationships.contacts) {
      return LoadingState.FULLY_LOADED
    }
    if (json.relationships) {
      return LoadingState.LOADED_FOR_LISTS
    }
    if (json.attributes) {
      return LoadingState.LOADED_AS_ATTRIBUTE
    }
    return LoadingState.NOT_LOADED
  }

  fetchParentOrga (Orga, id, clone, strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    // TODO remove creation of empty orga in Orga.get/Event.get when id = null
    if (!id) {
      this.parent_orga = null
      return Promise.resolve()
    }
    return Orga.get(id, strategy).then(orga => {
      this.parent_orga = orga
    })
  }

  fetchCategory (Category, id) {
    return Category.get(id).then(category => {
      this.category = category
    })
  }

  fetchSubCategory (Category, id) {
    return Category.get(id).then(category => {
      this.sub_category = category
    })
  }

  fetchContacts (Contact, clone) {
    return Contact.forOwner(this).getAll().then(contacts => {
      this.contacts = []
      contacts.forEach(contact => {
        contact = clone ? contact.clone() : contact
        this.contacts.push(contact)
      })
    })
  }

  fetchAnnotations (Annotation, clone) {
    return Annotation.forOwner(this).getAll().then(annotations => {
      this.annotations = []
      annotations.forEach(annotation => {
        annotation = clone ? annotation.clone() : annotation
        this.annotations.push(annotation)
      })
    })
  }

  fetchCreator (User, id) {
    return User.get(id).then(creator => {
      this.creator = creator
    })
  }

  fetchLastEditor (User, id) {
    return User.get(id).then(editor => {
      this.last_editor = editor
    })
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
