import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ResourceItem from '@/models/ResourceItem'
import Resource from './base/Resource'

class ResourceItemsResource extends Resource {
  init ([orgaId]) {
    this.orgaId = orgaId

    this.http = Vue.resource(BASE + `orgas/${orgaId}/resource_items{/id}`, {}, {update: {method: 'PATCH'}})
    this.listType = 'resource_items'
    this.listParams = JSON.stringify({owner_type: 'orgas', owner_id: orgaId, relation: 'resource_items'})
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
