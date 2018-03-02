import Category from '@/models/Category'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class CategoriesResource extends Resource {
  init () {
    this.url = 'categories{/id}'
    this.http = Vue.resource(BASE + this.url, {}, {update: {method: 'PATCH'}})
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
