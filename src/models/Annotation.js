import AnnotationCategory from '@/models/AnnotationCategory'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Relation from 'uidata/model/Relation'

class Annotation extends Model {
  static type = 'annotations'

  static attributes () {
    return {
      detail: {
        type: DataTypes.String
      }
    }
  }

  static relations () {
    return {
      annotationCategory: {
        type: Relation.HAS_ONE,
        Model: AnnotationCategory
      }
    }
  }

  normalizeJson (json) {
    let {detail} = json.attributes
    return {
      id: json.id,
      attributes: {detail},
      relationships: {
        annotationCategory: {
          _requestId: json._requestId,
          id: json.attributes.annotation_category_id
        }
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
    return super.info + ` category="${this.$rels.annotationCategory.id}"`
  }
}

export default Model.register(Annotation)
