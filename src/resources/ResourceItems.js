import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ResourceItem from '@/models/ResourceItem'
import BaseResource from './base/BaseResource'

class ResourceItemsResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'resource_items{/id}')
    this.listCacheKey = 'resource_items'
  }

  createItem () {
    return new ResourceItem()
  }
}

export default {
  getAllForOrga (id) {
    const resource = new ResourceItemsResource()
    resource.http = Vue.resource(BASE + `orgas/${id}/resource_items`)
    resource.listCacheKey = `orgas/${id}/relationships/resource_items`
    return store.dispatch('api/getList', {resource})
  },

  getAll () {
    const resource = new ResourceItemsResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new ResourceItemsResource()
    return store.dispatch('api/getItem', {resource, id})
  },
  /*
   * public method to create new ResourceItem in EditEntry component
   */
  createItem () {
    const resource = new ResourceItemsResource()
    return resource.createItem()
  }
}
