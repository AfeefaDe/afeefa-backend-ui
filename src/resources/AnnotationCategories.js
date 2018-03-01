import AnnotationCategory from '@/models/AnnotationCategory'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class AnnotationCategoriesResource extends Resource {
  init () {
    this.url = 'annotation_categories'
    this.http = Vue.resource(BASE + this.url + '{/id}')
  }

  getItemModel () {
    return AnnotationCategory
  }
}

class AnnotationCategories extends Query {
  getApi () {
    return ['getAll', 'get']
  }

  createResource () {
    return new AnnotationCategoriesResource()
  }

  get (id) {
    return this.getAll().then(() => {
      return super.get(id)
    })
  }
}

export default new AnnotationCategories()
