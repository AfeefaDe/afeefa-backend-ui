import BaseModel from './base/BaseModel'

export default class AnnotionCategory extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'annotationCategories'
    this.title = ''
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title
  }
}
