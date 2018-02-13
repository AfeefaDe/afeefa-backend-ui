import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Category extends Model {
  static attributes = {
    title: DataTypes.String
  }

  static relations = {
    parent_category: {
      type: Relation.HAS_ONE,
      cacheKey: 'categories',
      data: json => (json.data && json.data.id)
    }
  }

  init () {
    super.init()

    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.id = null
    this.type = 'categories'

    this.parent_category = null
    this.sub_categories = []
  }

  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(json.attributes)
    this.deserializeRelations(json.relationships)
  }

  get info () {
    const subCat = !!this.relation('parent_category').id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}
