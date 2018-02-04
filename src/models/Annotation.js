import BaseModel from './base/BaseModel'

export default class Annotion extends BaseModel {
  init () {
    this._fullyLoaded = true // there is no half-loaded-state

    this.id = null
    this.type = 'annotations'
    this.detail = ''
    this.annotationCategory = null
    this._relationIds = {
      annotationCategory: null
    }
  }

  deserialize (json) {
    this.id = json.id
    this.detail = json.attributes.detail
    this._relationIds.annotationCategory = json.attributes.annotation_category_id
  }

  serialize () {
    // always send full annotation cause the title could have changed
    let data = {
      type: this.type,
      id: this.id,
      attributes: {
        detail: this.detail,
        annotation_category_id: this.annotationCategory.id
      }
    }
    // in case we are creating a new annotation strip away the id attribute
    if (this.id === null) {
      delete data['id']
    }
    return data
  }
}
