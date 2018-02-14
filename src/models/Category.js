import Model from './base/Model'
import LoadingState from '@/store/api/LoadingState'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Category extends Model {
  static query (Categories) {
    return Categories
  }

  static attributes = {
    title: DataTypes.String,

    sub_categories: DataTypes.Array
  }

  static relations () {
    return {
      parent_category: {
        type: Relation.HAS_ONE,
        itemType: 'categories',
        data: json => (json.data && json.data.id)
      }
    }
  }

  init () {
    this._loadingState = LoadingState.FULLY_LOADED // there is no half-loaded-state for this model

    this.type = 'categories'
  }

  getAttributesFromJson (json) {
    return json.attributes
  }

  getRelationsFromJson (json) {
    return json.relationships
  }

  get info () {
    const subCat = !!this.relation('parent_category').id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}
