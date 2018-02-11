import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class AnnotionCategory extends Model {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'annotationCategories'

    this.attr('title', DataTypes.String)
    this.attr('generatedBySystem', DataTypes.Boolean, {
      remoteName: 'generated_by_system'
    })
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)
  }
}
