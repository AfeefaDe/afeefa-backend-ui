import BaseModel from './BaseModel'
import User from '../User'

export default class Entry extends BaseModel {
  init () {
    this.id = null
    this.type = null

    this.title = ''
    this.description = ''
    this.short_description = ''
    this.media_url = ''
    this.support_wanted = false
    this.support_wanted_detail = ''
    this.certified_sfr = false
    this.tags = ''

    this.active = false
    this.created_at = new Date()
    this.updated_at = new Date()
    this.state_changed_at = new Date()

    this.parent_orga = null
    this.category = null
    this.sub_category = null
    this.location = null
    this.contact = null
    this.annotations = []
    this.creator = null
    this.lastEditor = null

    this.facebook_id = null

    this.inheritance = {
      short_description: false,
      contact_infos: false
    }

    this._relationIds = {
      parent_orga: null,
      category: null,
      sub_category: null,
      location: null,
      contact: null,
      annotations: []
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
        contact_infos: {
          data: !this.contact || this.contact.isEmpty()
            ? []
            : [this.contact.serialize()]
        },
        locations: {
          data: !this.location || this.location.isEmpty()
            ? []
            : [this.location.serialize()]
        },
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

  deserialize (json) {
    this.init()

    this.id = json.id
    this.type = json.type

    this.title = json.attributes.title || ''
    this.description = json.attributes.description || ''
    this.short_description = json.attributes.short_description || ''
    this.media_url = json.attributes.media_url || ''
    this.support_wanted = json.attributes.support_wanted
    this.support_wanted_detail = json.attributes.support_wanted_detail
    this.certified_sfr = json.attributes.certified_sfr
    this.tags = json.attributes.tags

    this.facebook_id = json.attributes.facebook_id

        // feed inheritance object with values
    if (json.attributes.inheritance) {
      json.attributes.inheritance.split('|').forEach(key => {
        this.inheritance[key] = true
      })
    }

    this.active = json.attributes.active === true
    this.created_at = new Date(json.attributes.created_at)
    this.updated_at = new Date(json.attributes.updated_at)
    this.state_changed_at = new Date(json.attributes.state_changed_at)

    const rels = json.relationships

    // parent orga / orga
    if (this.type === 'orgas' && rels.parent_orga && rels.parent_orga.data) {
      this._relationIds.parent_orga = rels.parent_orga.data.id
    }
    if (this.type === 'events' && rels.orga && rels.orga.data) {
      this._relationIds.parent_orga = rels.orga.data.id
    }

    // category
    if (rels.category.data) {
      this._relationIds.category = rels.category.data.id
    }

    // subcategory
    if (rels.sub_category.data) {
      this._relationIds.sub_category = rels.sub_category.data.id
    }

    // annotations
    if (rels.annotations.data.length) {
      for (let jsonAnnotation of rels.annotations.data) {
        if (!this._relationIds.annotations.includes(jsonAnnotation.id)) {
          this._relationIds.annotations.push(jsonAnnotation.id)
        }
      }
    }

    // location
    if (rels.locations && rels.locations.data.length) {
      this._relationIds.location = rels.locations.data[0].id
    }

    // contact
    if (rels.contact_infos && rels.contact_infos.data.length) {
      this._relationIds.contact = rels.contact_infos.data[0].id
    }

    // creator, last editor
    if (rels.creator.data) {
      this.creator = new User()
      this.creator.deserialize(rels.creator.data)
    }
    if (rels.last_editor.data) {
      this.lastEditor = new User()
      this.lastEditor.deserialize(rels.last_editor.data)
    }
  }

  clone (entry) {
    entry.id = this.id
    entry.type = this.type
    entry.title = this.title
    entry.description = this.description
    entry.short_description = this.short_description
    entry.media_url = this.media_url
    entry.support_wanted = this.support_wanted
    entry.support_wanted_detail = this.support_wanted_detail
    entry.certified_sfr = this.certified_sfr
    entry.tags = this.tags
    entry.facebook_id = this.facebook_id
    // use deep clone for nested inheritance object
    entry.inheritance = {
      short_description: this.inheritance.short_description,
      contact_infos: this.inheritance.contact_infos
    }
    entry.active = this.active
    entry.created_at = this.created_at
    entry.updated_at = this.updated_at
    entry.state_changed_at = this.state_changed_at

    // use deep clone ‼️ please mind Orga.js and the sub_orgas attribute
    entry._relationIds = {
      parent_orga: this._relationIds.parent_orga,
      category: this._relationIds.category,
      sub_category: this._relationIds.sub_category,
      location: this._relationIds.location,
      contact: this._relationIds.contact,
      annotations: this._relationIds.annotations
    }

    return entry
  }
}
