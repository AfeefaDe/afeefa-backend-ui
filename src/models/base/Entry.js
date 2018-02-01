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

    const rels = json.relationships || {}

    // category
    if (rels.category && rels.category.data) {
      this._relationIds.category = rels.category.data.id
    }

    // subcategory
    if (rels.sub_category && rels.sub_category.data) {
      this._relationIds.sub_category = rels.sub_category.data.id
    }

    // annotations
    if (rels.annotations && rels.annotations.data.length) {
      for (let jsonAnnotation of rels.annotations.data) {
        if (!this._relationIds.annotations.includes(jsonAnnotation.id)) {
          this._relationIds.annotations.push(jsonAnnotation.id)
        }
      }
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
}
