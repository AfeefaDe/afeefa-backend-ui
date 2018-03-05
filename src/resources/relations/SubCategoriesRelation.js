import RelationQuery from 'data/resource/RelationQuery'
import Categories from '../Categories'

export default class SubCategoriesRelation extends RelationQuery {
  getApi () {
    return ['getAll']
  }

  getAll () {
    return Categories.getAll().then(categories => {
      const parentCategory = this.relation.owner
      const subCategories = categories.filter(c => c.$rels.parent_category.id === parentCategory.id)
      return Promise.resolve(subCategories)
    })
  }
}
