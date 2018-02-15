import Vue from 'vue'
import { BASE } from '@/store/api'
import Category from '@/models/Category'
import Resource from './base/Resource'
import Query from './base/Query'

class CategoriesResource extends Resource {
  init () {
    this.url = 'categories'
    this.http = Vue.resource(BASE + this.url + '{/id}')
    this.listType = 'categories'
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
      const parentId = category.relation('parent_category').id
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
