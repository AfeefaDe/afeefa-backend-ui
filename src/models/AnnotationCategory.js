import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
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

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  get info () {
    return super.info + ` title="${this.title}"`
  }
}
