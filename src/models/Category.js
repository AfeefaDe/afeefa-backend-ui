import BaseModel from './base/BaseModel'
import LoadingState from '@/store/api/LoadingState'
import CachedRelation from '@/models/base/CachedRelation'

export default class Category extends BaseModel {
  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'categories'
    this.title = ''

    this.parent_category = null
    this.sub_categories = []
  }

  parentCategoryRelation () {
    return new CachedRelation({
      type: CachedRelation.HAS_ONE,
      cacheKey: 'categories'
    })
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title

    const rels = json.relationships

    // category
    if (rels.parent_category.data) {
      this.relation('parentCategory').initWithId(rels.parent_category.data.id)
    }
  }
}
