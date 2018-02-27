import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

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

  fetchParentCategory (Category, id) {
    return Category.get(id)
  }

  clone () {
    // do not allow cloning of a category by now
    // preselection of category selectors may disappears
    // as we are creating a new instance here
    return this
  }

  get info () {
    const subCat = !!this.relation('parent_category').id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}
