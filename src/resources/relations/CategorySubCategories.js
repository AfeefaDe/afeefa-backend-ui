import Category from '@/models/Category'
import RelationResource from 'uidata/resource/RelationResource'

export default class SubCategoriesRelation extends RelationResource {
  getAll () {
    return Category.Query.getAll().then(categories => {
      const parentCategory = this.relation.owner
      const subCategories = categories.filter(c => c.$rels.parent_category.id === parentCategory.id)
      return Promise.resolve(subCategories)
    })
  }
}
