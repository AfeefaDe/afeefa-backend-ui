import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Annotion extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'annotations'

    this.attr('detail', DataTypes.String)

    this.annotationCategory = null
  }

  annotationCategoryRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'annotationCategories'}
    )
  }

  fetchCategory () {
    this.relation('annotationCategory').fetch(id => {
      return this.Resource('AnnotationCategories').get(id).then(annotationCategory => {
        this.annotationCategory = annotationCategory
        return annotationCategory
      })
    })
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)

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

  clone (annotation) {
    const clone = super.clone()
    clone.fetchCategory()
    return clone
  }

  get info () {
    return `[Annotation id=${this.id} ID=${this._ID} category="${this.relation('annotationCategory').id}"]`
  }
}
