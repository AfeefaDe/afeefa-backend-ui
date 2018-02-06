import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'

export default class Category extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state

    this.id = null
    this.type = 'categories'
    this.title = ''

    this.parent_category = null
    this.sub_categories = []

    this._relationIds = {
      parent_category: null
    }
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title

    const rels = json.relationships

    // category
    if (rels.parent_category.data) {
      this._relationIds.parent_category = rels.parent_category.data.id
    }
  }
}
