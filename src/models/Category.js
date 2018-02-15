import Model from './base/Model'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Category extends Model {
  static type = 'categories'

  static query (Categories) {
    return Categories
  }

  static attributes () {
    return {
      title: DataTypes.String,

      sub_categories: DataTypes.Array
    }
  }

  static relations () {
    return {
      parent_category: {
        type: Relation.HAS_ONE,
        Model: Category
      }
    }
  }

  fetchParentCategory () {
    // empty
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
