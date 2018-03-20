import Category from '@/models/Category'
import Resource from 'uidata/resource/Resource'

export default class CategorySubCategoriesResource extends Resource {
  getAll () {
    const category = this.relation.owner
    const params = category.area ? {area: category.area} : undefined

    return Category.Query.getAll(params).then(categories => {
      const parentCategory = this.relation.owner
      const subCategories = categories.filter(c => c.$rels.parent_category.id === parentCategory.id)
      return Promise.resolve(subCategories)
    })
  }
}
