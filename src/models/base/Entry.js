export default class Entry {
  constructor () {
    this.init()
  }

  init () {
    this.id = null
    this.type = null

    this.title = ''
    this.description = ''
    this.active = false
    this.created_at = new Date()
    this.updated_at = new Date()
    this.state_changed_at = new Date()
    this.media_url = ''

    this.parent_orga = null
    this.category = null
    this.sub_category = null
    this.location = null
    this.contact = null
    this.annotations = []

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

    const data = {
      type: this.type,
      attributes: {
        title: this.title,
        description: this.description,
        active: this.active,
        media_url: this.media_url
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
    this.active = json.attributes.active === true
    this.created_at = new Date(json.attributes.created_at)
    this.updated_at = new Date(json.attributes.updated_at)
    this.state_changed_at = new Date(json.attributes.state_changed_at)

    this.media_url = json.attributes.media_url || ''
    this.media_url = this.validateUrl(this.media_url)

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
  }

  validateUrl (url) {
    let img = new Image()
    img.src = url

    img.onerror = function () {
      return ''
    }
    return url
  }

  clone (entry) {
    entry.id = this.id
    entry.type = this.type
    entry.title = this.title
    entry.media_url = this.media_url
    entry.description = this.description
    entry.active = this.active
    entry.created_at = this.created_at
    entry.updated_at = this.updated_at
    entry.state_changed_at = this.state_changed_at

    entry._relationIds = this._relationIds

    return entry
  }
}
