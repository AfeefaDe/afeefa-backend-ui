import LoadingStrategy from '@/store/api/LoadingStrategy'
import DataTypes from './DataTypes'
import Model from './Model'
import Relation from './Relation'
import User from '../User'

export default class Entry extends Model {
  init () {
    super.init()

    this.id = null
    this.type = null

    this.attr('title', DataTypes.String)
    this.attr('description', DataTypes.String)
    this.attr('short_description', DataTypes.String)
    this.attr('media_url', DataTypes.String)
    this.attr('support_wanted', DataTypes.Boolean)
    this.attr('support_wanted_detail', DataTypes.String)
    this.attr('certified_sfr', DataTypes.Boolean)
    this.attr('tags', DataTypes.String)
    this.attr('facebook_id', DataTypes.Date)
    this.attr('inheritance', DataTypes.Custom, {
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
    })

    this.attr('active', DataTypes.Boolean)
    this.attr('created_at', DataTypes.Date)
    this.attr('updated_at', DataTypes.Date)
    this.attr('state_changed_at', DataTypes.Date)

    this.parent_orga = null
    this.category = null
    this.sub_category = null
    this.contacts = []
    this.annotations = []
    this.creator = null
    this.lastEditor = null
  }

  parentOrgaRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'orgas',
      Model: this.Model('Orga')
    })
  }

  categoryRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'categories'
    })
  }

  subCategoryRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'categories'
    })
  }

  contactsRelation () {
    return new Relation({
      type: Relation.HAS_MANY,
      cacheKey: 'contacts',
      cacheParams: {owner_type: this.type, owner_id: this.id},
      Model: this.Model('Contact')
    })
  }

  annotationsRelation () {
    return new Relation({
      type: Relation.HAS_MANY,
      cacheKey: 'annotations',
      cacheParams: {owner_type: this.type, owner_id: this.id},
      Model: this.Model('Annotation')
    })
  }

  fetchParentOrga (strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    this.relation('parentOrga').fetch(id => {
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
    this.relation('subCategory').fetch(id => {
      return this.Resource('Categories').get(id).then(category => {
        this.sub_category = category
        return category
      })
    })
  }

  fetchContacts (clone) {
    this.relation('contacts').fetch(() => {
      return this.Resource('Contacts').getAllForOwner(this).then(contacts => {
        this.contacts.length = 0
        contacts.forEach(contact => {
          contact = clone ? contact.clone() : contact
          this.contacts.push(contact)
        })
        return contacts
      })
    })
  }

  fetchAnnotations (clone) {
    this.relation('annotations').fetch(() => {
      return this.Resource('Annotations').getAllForOwner(this).then(annotations => {
        this.annotations.length = 0
        annotations.forEach(annotation => {
          annotation = clone ? annotation.clone() : annotation
          this.annotations.push(annotation)
        })
        return annotations
      })
    })
  }

  deserialize (json) {
    this.init()

    this.id = json.id
    this.type = json.type

    this.deserializeAttributes(json.attributes)

    const rels = json.relationships || {}

    // category
    if (rels.category && rels.category.data) {
      this.relation('category').initWithId(rels.category.data.id)
    }

    // subcategory
    if (rels.sub_category && rels.sub_category.data) {
      this.relation('subCategory').initWithId(rels.sub_category.data.id)
    }

    // contacts
    if (rels.contacts) {
      this.relation('contacts').initWithJson(rels.contacts.data)
    }

    // annotations
    if (rels.annotations) {
      this.relation('annotations').initWithJson(rels.annotations.data)
    }

    // creator, last editor
    if (rels.creator && rels.creator.data) {
      this.creator = new User()
      this.creator.deserialize(rels.creator.data)
    }

    if (rels.last_editor && rels.last_editor.data) {
      this.lastEditor = new User()
      this.lastEditor.deserialize(rels.last_editor.data)
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

  clone () {
    const clone = super.clone()
    clone.fetchParentOrga()
    clone.fetchCategory()
    clone.fetchSubCategory()
    clone.fetchAnnotations(true) // true => annotation.clone()
    clone.fetchContacts(true) // true => contact.clone()
    return clone
  }

  updateAttributes (attributes) {
    if (attributes) {
      if ('active' in attributes) {
        this.active = attributes.active === true
        this.state_changed_at = new Date(attributes.state_changed_at)
      }
      this.updated_at = new Date(attributes.updated_at)
    }
  }

  get info () {
    const type = this.type.charAt(0).toUpperCase() + this.type.slice(1)
    return `[${type} id=${this.id} ID=${this._ID} title="${this.title}" clone="${this._isClone}"]`
  }
}
