import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Annotation extends Model {
  static attributes = {
    detail: {
      type: DataTypes.String
    }
  }

  static relations () {
    return {
      annotationCategory: {
        type: Relation.HAS_ONE,
        itemType: 'annotationCategories',
        data: json => json
      }
    }
  }

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'annotations'
  }

  fetchCategory () {
    this.relation('annotationCategory').fetch(id => {
      return this.Resource('AnnotationCategories').get(id).then(annotationCategory => {
        this.annotationCategory = annotationCategory
        return annotationCategory
      })
    })
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  getRelationsFromJson (json) {
    return {
      annotationCategory: json.attributes.annotation_category_id
    }
  }

  afterDeserialize () {
    this.fetchCategory()
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

  clone (annotation) {
    const clone = super.clone()
    clone.fetchCategory()
    return clone
  }

  get info () {
    return super.info + ` category="${this.relation('annotationCategory').id}"`
  }
}
