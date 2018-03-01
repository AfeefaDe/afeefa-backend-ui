import AnnotationCategories from '@/resources/AnnotationCategories'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'

export default class AnnotationCategory extends Model {
  static type = 'annotationCategories'

  static query = AnnotationCategories

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
