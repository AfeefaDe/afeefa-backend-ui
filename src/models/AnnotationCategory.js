import AnnotationCategories from '@/resources/AnnotationCategories'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

class AnnotationCategory extends Model {
  static type = 'annotationCategories'

  static Query = AnnotationCategories

  static attributes () {
    return {
      title: DataTypes.String,

      generatedBySystem: {
        type: DataTypes.Boolean,
        remoteName: 'generated_by_system'
      }
    }
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}

export default Model.register(AnnotationCategory)
