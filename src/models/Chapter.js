import BaseModel from './base/BaseModel'

export default class Chapter extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state
    this.type='chapter'
    this.id = null
    this.title = ''
    this.content = ''
    this.order = 0
    // this.created_at = new Date()
    // this.updated_at = new Date()
  }

  serialize () {
    let data = {
      id: this.id,
      title: this.title,
      content: this.content,
      order: this.order
    }
    // in case we are creating a new resource strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.title
    this.content = json.content
    this.order = json.order
    this.type = 'chapter'
    // this.created_at = new Date(json.created_at)
    // this.updated_at = new Date(json.updated_at)
  }
}
