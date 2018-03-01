import ResourceItem from '@/models/ResourceItem'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class ResourceItemsResource extends Resource {
  init (orga) {
    this.orga = orga

    this.url = `orgas/${orga.id}/resource_items`
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})

    this.listParams = orga.relation('resource_items').listParams()
  }

  getItemModel () {
    return ResourceItem
  }
}

class ResourceItems extends Query {
  getApi () {
    return ['forOwner', 'getAll']
  }

  createResource ({owner}) {
    return new ResourceItemsResource(owner)
  }
}

export default new ResourceItems()
