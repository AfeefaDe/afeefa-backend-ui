import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Category from '@/models/Category'
import Resource from './base/Resource'

class CategoriesResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'categories{/id}')
    this.listCacheKey = 'categories'
  }

  createItem () {
    return new Category()
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

export default {
  getAll () {
    const resource = new CategoriesResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new CategoriesResource()
    return this.getAll().then(() => {
      return store.dispatch('api/getItem', {resource, id})
    })
  }
}
