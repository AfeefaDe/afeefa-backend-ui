import Category from '@/models/Category'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class CategoriesResource extends Resource {
  init () {
    this.url = 'categories{/id}'
  }

  getItemModel () {
    return Category
  }

  transformList (categories) {
    const categoriesMap = {}
    for (let category of categories) {
      categoriesMap[category.id] = category
    }

    for (let category of categories) {
      const parentId = category.$rels.parent_category.id
      const parentCategory = categoriesMap[parentId]
      if (parentCategory) {
        category.parent_category = parentCategory
        parentCategory.sub_categories.push(category)
      }
    }
  }
}

class Categories extends Query {
  getApi () {
    return ['getAll', 'get']
  }

  createResource () {
    return new CategoriesResource()
  }

  get (id) {
    return this.getAll().then(() => {
      return super.get(id)
    })
  }
}

export default new Categories()
