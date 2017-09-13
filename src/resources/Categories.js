import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Category from '@/models/Category'
import BaseResource from './base/BaseResource'

class CategoriesResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'categories{/id}')
    this.listCacheKey = 'categories'
  }

  createItem () {
    return new Category()
  }

  transformList (items) {
    const categoriesMap = {}
    for (let category of items) {
      categoriesMap[category.id] = category
    }

    for (let category of items) {
      const parentId = category._relationIds.parent_category
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
