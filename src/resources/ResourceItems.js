import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ResourceItem from '@/models/ResourceItem'
import BaseResource from './base/BaseResource'

class ResourceItemsResource extends BaseResource {
  init ([orgaId]) {
    this.orgaId = orgaId

    this.http = Vue.resource(BASE + `orgas/${orgaId}/resource_items{/id}`, {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'resource_items'
    this.listCacheParams = JSON.stringify({owner_type: 'orgas', owner_id: orgaId})
  }

  createItem () {
    return new ResourceItem()
  }
}

export default {
  getAllForOrga (orga) {
    const resource = new ResourceItemsResource(orga.id)
    return store.dispatch('api/getList', {resource})
  }
}
