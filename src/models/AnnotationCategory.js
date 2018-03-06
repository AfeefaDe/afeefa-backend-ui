import AnnotationCategories from '@/resources/AnnotationCategories'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'

class AnnotationCategory extends Model {
  static type = 'annotationCategories'

  static Resource = new AnnotationCategories(AnnotationCategory)

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
