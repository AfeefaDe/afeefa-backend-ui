import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from '@/models/base/Relation'

export default class Category extends Model {
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
    return new Relation({
      type: Relation.HAS_ONE,
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
