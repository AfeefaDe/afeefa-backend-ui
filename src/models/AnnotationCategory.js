import BaseModel from './base/BaseModel'

export default class AnnotionCategory extends BaseModel {
  init () {
    super.init()

    this._fullyLoaded = true // there is no half-loaded-state

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
