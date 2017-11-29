import BaseModel from './base/BaseModel'

export default class Chapter extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'chapter'
    this.title = ''
    this.content = ''
    this.order = -1
    this.area = ''
    this.created_at = new Date()
    this.updated_at = new Date()
  }

  serialize () {
    let data = {
      type: this.type,
      id: this.id,
      attributes: {
        title: this.title,
        content: this.content,
        order: this.order,
        area: this.area
      }
    }
    // in case we are creating a new resource strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title
    this.content = json.attributes.content
    this.order = json.attributes.order
    this.area = json.attributes.area
    this.created_at = new Date(json.attributes.created_at)
    this.updated_at = new Date(json.attributes.updated_at)
  }
}
