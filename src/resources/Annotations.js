import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Annotation from '@/models/Annotation'
import BaseResource from './base/BaseResource'

class AnnotationsResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'annotations{/id}')
    this.listCacheKey = 'annotations'
  }

  createItem () {
    return new Annotation()
  }
}

export default {
  getAll () {
    const resource = new AnnotationsResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new AnnotationsResource()
    return this.getAll().then(() => {
      return store.dispatch('api/getItem', {resource, id})
    })
  },
  /*
   * public method to create new annoation in editentry form
   */
  createItem () {
    const resource = new AnnotationsResource()
    return resource.createItem()
  }
}
