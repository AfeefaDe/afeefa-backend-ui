import Category from '@/models/Category'
import Resource from 'uidata/resource/Resource'

export default class CategorySubCategoriesResource extends Resource {
  getAll () {
    return Category.Query.getAll().then(categories => {
      const parentCategory = this.relation.owner
      const subCategories = categories.filter(c => c.$rels.parent_category.id === parentCategory.id)
      return Promise.resolve(subCategories)
    })
  }
}
