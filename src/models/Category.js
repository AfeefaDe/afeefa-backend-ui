import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Category extends Model {
  static attributes = {
    title: DataTypes.String
  }

  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'categories'

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

    this.deserializeAttributes(json.attributes)

    const rels = json.relationships

    // category
    if (rels.parent_category.data) {
      this.relation('parentCategory').initWithId(rels.parent_category.data.id)
    }
  }

  get info () {
    const subCat = !!this.relation('parentCategory').id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}
