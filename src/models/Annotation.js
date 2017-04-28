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

  serialize () {
    let data
    // new annotation: send full annotation object
    if (this.id === null) {
      data = {
        type: this.type,
        attributes: {
          detail: this.detail,
          annotation_category_id: this.annotationCategory.id
        }
      }
      return data
    } else {
      // annotation exists: only send id and type
      data = {
        type: this.type,
        id: this.id
      }
    }
    return data
  }

  deserialize (json) {
    this.id = json.id
    this.detail = json.attributes.detail
    this._relationIds.annotationCategory = json.relationships.annotation_category.data.id
  }
}
