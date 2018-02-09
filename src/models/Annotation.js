import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'
import CachedRelation from '@/models/base/CachedRelation'

export default class Annotion extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'annotations'
    this.detail = ''
    this.annotationCategory = null
  }

  annotationCategoryRelation () {
    return new CachedRelation({type: CachedRelation.HAS_ONE, cacheKey: 'annotationCategories'})
  }

  deserialize (json) {
    this.id = json.id
    this.detail = json.attributes.detail

    this.relation('annotationCategory').initWithId(json.attributes.annotation_category_id)
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

  get info () {
    return `[Annotation id=${this.id} ID=${this.__ID} category="${this.relation('annotationCategory').id}"]`
  }
}
