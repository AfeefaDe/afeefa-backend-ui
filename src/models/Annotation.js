import Model from './base/Model'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Annotation extends Model {
  static type = 'annotations'

  static query (Annotations) {
    return Annotations
  }

  static attributes () {
    return {
      detail: {
        type: DataTypes.String
      }
    }
  }

  static relations (AnnotationCategory) {
    return {
      annotationCategory: {
        type: Relation.HAS_ONE,
        Model: AnnotationCategory
      }
    }
  }

  fetchAnnotationCategory () {
    this.relation('annotationCategory').fetch(id => {
      return this.Resource('AnnotationCategories').get(id).then(annotationCategory => {
        this.annotationCategory = annotationCategory
      })
    })
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  getRelationsFromJson (json) {
    return {
      annotationCategory: {
        id: json.attributes.annotation_category_id
      }
    }
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
    return super.info + ` category="${this.relation('annotationCategory').id}"`
  }
}
