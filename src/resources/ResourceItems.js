import ResourceItem from '@/models/ResourceItem'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class ResourceItemsResource extends Resource {
  init (relation) {
    this.url = `orgas/${relation.owner.id}/resource_items{/id}`
    this.http = Vue.resource(BASE + this.url, {}, {update: {method: 'PATCH'}})
  }

  getItemModel () {
    return ResourceItem
  }
}

class ResourceItems extends Query {
  getApi () {
    return ['forRelation', 'getAll']
  }

  createResource ({relation}) {
    return new ResourceItemsResource(relation)
  }
}

export default new ResourceItems()
