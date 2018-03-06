import Categories from '@/resources/Categories'
import CategoryRelation from '@/resources/relations/CategoryRelation'
import SubCategoriesRelation from '@/resources/relations/SubCategoriesRelation'
import DataTypes from 'data/model/DataTypes'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

class Category extends Model {
  static type = 'categories'

  static Query = Categories

  static attributes () {
    return {
      title: DataTypes.String
    }
  }

  static relations () {
    return {
      parent_category: {
        type: Relation.HAS_ONE,
        Model: Category,
        Query: CategoryRelation
      },

      sub_categories: {
        type: Relation.HAS_MANY,
        Model: Category,
        Query: SubCategoriesRelation
      }
    }
  }

  get info () {
    const subCat = !!this.$rels.parent_category.id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}

export default Model.register(Category)
