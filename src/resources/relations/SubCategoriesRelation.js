import RelationQuery from 'uidata/resource/RelationQuery'
import Categories from '../Categories'

export default class SubCategoriesRelation extends RelationQuery {
  getAll () {
    return Categories.getAll().then(categories => {
      const parentCategory = this.relation.owner
      const subCategories = categories.filter(c => c.$rels.parent_category.id === parentCategory.id)
      return Promise.resolve(subCategories)
    })
  }
}
