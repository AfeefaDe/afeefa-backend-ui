import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ResourceItem from '@/models/ResourceItem'
import Resource from './base/Resource'

class ResourceItemsResource extends Resource {
  init ([orga]) {
    this.orga = orga

    this.url = `orgas/${orga.id}/resource_items`
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})

    this.listType = 'resource_items'
    this.listParams = orga.relation('resource_items').listParams()
  }

  createItem () {
    return new ResourceItem()
  }
}

export default {
  getAllForOrga (orga) {
    const resource = new ResourceItemsResource(orga)
    return store.dispatch('api/getList', {resource})
  }
}
