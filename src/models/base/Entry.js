import LoadingStrategy from '@/store/api/LoadingStrategy'
import DataTypes from './DataTypes'
import Model from './Model'
import Relation from './Relation'
import LoadingState from '@/store/api/LoadingState'

export default class Entry extends Model {
  static attributes = {
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

  static relations = {
    category: {
      type: Relation.HAS_ONE,
      cacheKey: 'categories',
      data: json => (json.data && json.data.id)
    },

    sub_category: {
      type: Relation.HAS_ONE,
      cacheKey: 'categories',
      data: json => (json.data && json.data.id)
    },

    contacts: {
      type: Relation.HAS_MANY,
      cacheKey: 'contacts',
      cacheParams: owner => ({owner_type: owner.type, owner_id: owner.id}),
      Model: 'Contact',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    },

    annotations: {
      type: Relation.HAS_MANY,
      cacheKey: 'annotations',
      cacheParams: owner => ({owner_type: owner.type, owner_id: owner.id}),
      Model: 'Annotation',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    },

    creator: {
      type: Relation.HAS_ONE,
      cacheKey: 'users',
      Model: 'User',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    },

    last_editor: {
      type: Relation.HAS_ONE,
      cacheKey: 'users',
      Model: 'User',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    }
  }

  init () {
    super.init()

    this.id = null
    this.type = null
  }

  fetchParentOrga (strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    this.relation('parent_orga').fetch(id => {
      return this.Resource('Orgas').get(id, ['fetchParentOrga'], strategy, { // fetch parent orga with only its own parent orga relation
        'fetchParentOrga': LoadingStrategy.LOAD_IF_NOT_CACHED // do not force fully loading of parents parent orga
      }).then(orga => {
        this.parent_orga = orga
        return orga
      })
    }, strategy)
  }

  fetchCategory () {
    this.relation('category').fetch(id => {
      return this.Resource('Categories').get(id).then(category => {
        this.category = category
        return category
      })
    })
  }

  fetchSubCategory () {
    this.relation('sub_category').fetch(id => {
      return this.Resource('Categories').get(id).then(category => {
        this.sub_category = category
        return category
      })
    })
  }

  fetchContacts (clone) {
    this.relation('contacts').fetch(() => {
      return this.Resource('Contacts').getAllForOwner(this).then(contacts => {
        this.contacts = []
        contacts.forEach(contact => {
          contact = clone ? contact.clone() : contact
          this.contacts.push(contact)
          contact.fetchContactPersons() // TODO
        })
        return contacts
      })
    })
  }

  fetchAnnotations (clone) {
    this.relation('annotations').fetch(() => {
      return this.Resource('Annotations').getAllForOwner(this).then(annotations => {
        this.annotations = []
        annotations.forEach(annotation => {
          annotation = clone ? annotation.clone() : annotation
          this.annotations.push(annotation)
        })
        return annotations
      })
    })
  }

  fetchCreator () {
    this.relation('creator').fetch(id => {
      return this.Resource('Users').get(id).then(creator => {
        this.creator = creator
        return creator
      })
    })
  }

  fetchLastEditor () {
    this.relation('last_editor').fetch(id => {
      return this.Resource('Users').get(id).then(editor => {
        this.last_editor = editor
        return editor
      })
    })
  }

  deserialize (json) {
    // this.init() TODO !!!
    // console.log('DESERIALIZE', this.info, 'json:request:', json._requestId, json)

    this.id = json.id
    this.type = json.type

    this.deserializeAttributes(json.attributes)
    this.deserializeRelations(json.relationships)
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

  clone () {
    const clone = super.clone()
    clone.fetchParentOrga()
    clone.fetchCategory()
    clone.fetchSubCategory()
    clone.fetchAnnotations(true) // true => annotation.clone()
    clone.fetchContacts(true) // true => contact.clone()
    return clone
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}
