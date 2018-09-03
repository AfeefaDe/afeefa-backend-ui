import AnnotationCategory from '@/models/AnnotationCategory'
import User from '@/models/User'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class Annotation extends Model {
  static type = 'annotations'

  static attributes () {
    return {
      detail: DataTypes.String,

      created_at: DataTypes.Date,

      updated_at: DataTypes.Date
    }
  }

  static relations () {
    return {
      annotationCategory: {
        type: Relation.HAS_ONE,
        Model: AnnotationCategory
      },

      creator: {
        type: Relation.HAS_ONE,
        Model: User
      },

      last_editor: {
        type: Relation.HAS_ONE,
        Model: User
      }
    }
  }

  beforeDeserialize (json) {
    json.relationships = json.relationships || {}
    json.relationships.annotationCategory = {
      id: json.attributes.annotation_category_id
    }
    return json
  }

  serialize () {
    return {
      detail: this.detail,
      annotation_category_id: this.annotationCategory.id
    }
  }

  get info () {
    return super.info + ` category="${this.$rels.annotationCategory.id}"`
  }
}

export default Registry.add(Annotation)
