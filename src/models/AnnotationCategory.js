import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'

export default class AnnotionCategory extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'annotationCategories'
    this.generatedBySystem = false
    this.title = ''
  }

  deserialize (json) {
    this.id = json.id
    this.generatedBySystem = json.attributes.generated_by_system
    this.title = json.attributes.title
  }
}
