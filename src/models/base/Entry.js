import BaseModel from './BaseModel'
import Annotation from '@/models/Annotation'
import AnnotationCategories from '@/resources/AnnotationCategories'

export default class Entry extends BaseModel {
  init () {
    this.id = null
    this.type = null

    this.title = ''
    this.description = ''
    this.short_description = ''
    this.media_url = ''
    this.for_children = false
    this.support_wanted = false
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

    this.inheritance = {
      short_description: false,
      contact_infos: false
    }

    this._relationIds = {
      parent_orga: null,
      category: null,
      sub_category: null,
      location: null,
      contact: null
    }
  }

  serialize () {
    const annotations = []
    for (let annotation of this.annotations) {
      annotations.push(annotation.serialize())
    }

    // create array of inheritance properties
    let inheritanceArray = []
    Object.keys(this.inheritance).forEach((key) => {
      if (this.inheritance[key] === true) {
        inheritanceArray.push(key)
      }
    })
    let inheritance = null
    if (inheritanceArray.length > 0) {
      inheritance = inheritanceArray.join('|')
    }

    const data = {
      type: this.type,
      attributes: {
        title: this.title,
        description: this.description,
        short_description: this.short_description,
        active: this.active,
        media_url: this.media_url,
        for_children: this.for_children,
        support_wanted: this.support_wanted,
        certified_sfr: this.certified_sfr,
        tags: this.tags,
        inheritance: inheritance
      },
      relationships: {
        contact_infos: {
          data: this.contact.isEmpty()
            ? []
            : [this.contact.serialize()]
        },
        locations: {
          data: this.location.isEmpty()
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
    this.for_children = json.attributes.for_children
    this.support_wanted = json.attributes.support_wanted
    this.certified_sfr = json.attributes.certified_sfr
    this.tags = json.attributes.tags

    // feed inheritance object with values
    if (json.attributes.inheritance) {
      const inheritanceArray = json.attributes.inheritance.split('|')
      for (let i in inheritanceArray) {
        if (inheritanceArray[i] === 'short_description') {
          this.inheritance.short_description = true
        }
        if (inheritanceArray[i] === 'contact_infos') {
          this.inheritance.contact_infos = true
        }
      }
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

    // @todo: not working for response of PATCH request cause data is empty
    if (rels.annotations.data.length) {
      for (let jsonAnnotation of rels.annotations.data) {
        let annotation = new Annotation()
        annotation.deserialize(jsonAnnotation)
        let annotationCategoryId = jsonAnnotation.relationships.annotation_category.data.id
        AnnotationCategories.get(annotationCategoryId).then(annotationCategory => {
          annotation.annotationCategory = annotationCategory
          this.annotations.push(annotation)
        })
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
  }

  clone (entry) {
    entry.id = this.id
    entry.type = this.type
    entry.title = this.title
    entry.description = this.description
    entry.short_description = this.short_description
    entry.media_url = this.media_url
    entry.for_children = this.for_children
    entry.support_wanted = this.support_wanted
    entry.certified_sfr = this.certified_sfr
    entry.tags = this.tags
    entry.inheritance = this.inheritance
    entry.annotations = this.annotations

    entry.active = this.active
    entry.created_at = this.created_at
    entry.updated_at = this.updated_at
    entry.state_changed_at = this.state_changed_at

    entry._relationIds = this._relationIds

    return entry
  }
}
