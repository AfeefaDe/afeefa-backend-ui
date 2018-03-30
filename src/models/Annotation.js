import AnnotationCategory from '@/models/AnnotationCategory'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
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

  beforeDeserialize (json) {
    return {
      ...json,
      relationships: {
        annotationCategory: {
          id: json.attributes.annotation_category_id
        }
      }
    }
  }

  serialize () {
    let data = {
      type: this.type,
      attributes: {
        detail: this.detail,
        annotation_category_id: this.annotationCategory.id
      }
    }
    if (this.id) {
      data['id'] = this.id
    }
    return data
  }

  get info () {
    return super.info + ` category="${this.$rels.annotationCategory.id}"`
  }
}

export default Registry.add(Annotation)
