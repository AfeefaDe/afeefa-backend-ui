import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import AnnotationCategory from '@/models/AnnotationCategory'
import Resource from './base/Resource'

class AnnotationCategoriesResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'annotation_categories{/id}')
    this.listType = 'annotationCategories'
  }

  createItem () {
    return new AnnotationCategory()
  }
}

let annotationCategoriesLoaded = false


export default {
  getAll () {
    const resource = new AnnotationCategoriesResource()
    return store.dispatch('api/getList', {resource}).then(annotationCategories => {
      if (!annotationCategoriesLoaded) {
        annotationCategoriesLoaded = true
      }
      return annotationCategories
    })
  },

  get (id) {
    const resource = new AnnotationCategoriesResource()
    return this.getAll().then(() => {
      return store.dispatch('api/getItem', {resource, id})
    })
  }
}
