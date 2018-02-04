import BaseModel from './base/BaseModel'

export default class ResourceItem extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'resource_items'
    this.title = ''
    this.description = ''
    this.category = ''
    this.created_at = new Date()
    this.updated_at = new Date()
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title
    this.description = json.attributes.description
    this.category = json.attributes.tags
    this.created_at = new Date(json.attributes.created_at)
    this.updated_at = new Date(json.attributes.updated_at)
  }

  serialize () {
    let data = {
      type: this.type,
      id: this.id,
      attributes: {
        title: this.title,
        description: this.description,
        tags: this.category
      }
    }
    // in case we are creating a new resource strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }
}
