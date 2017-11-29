import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import BaseResource from './base/BaseResource'

class ChaptersResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'chapters{/id}')
    this.listCacheKey = 'chapters'
  }

  createItem () {
    return new ChaptersResource()
  }
}

export default {
  getAll () {
    const resource = new ChaptersResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new ChaptersResource()
    return store.dispatch('api/getItem', {resource, id})
  }
}
