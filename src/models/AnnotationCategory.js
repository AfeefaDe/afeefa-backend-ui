import Model from './base/Model'
import DataTypes from './base/DataTypes'

export default class AnnotationCategory extends Model {
  static type = 'annotationCategories'

  static query (AnnotationCategories) {
    return AnnotationCategories
  }

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
