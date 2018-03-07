import CategoriesResource from '@/resources/Categories'
import SubCategoriesRelationResource from '@/resources/relations/SubCategoriesRelation'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Relation from 'uidata/model/Relation'

class Category extends Model {
  static type = 'categories'

  static Resource = CategoriesResource

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
        Resource: CategoriesResource
      },

      sub_categories: {
        type: Relation.HAS_MANY,
        Model: Category,
        Resource: SubCategoriesRelationResource
      }
    }
  }

  get info () {
    const subCat = !!this.$rels.parent_category.id
    return super.info + ` subCat="${subCat}" title="${this.title}"`
  }
}

export default Model.register(Category)
