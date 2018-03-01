import Facet from '@/models/Facet'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class FacetsResource extends Resource {
  init () {
    this.url = 'facets'
    this.http = Vue.resource(BASE + this.url + '{/id}')
  }

  getItemModel () {
    return Facet
  }

  itemAdded () {
    this.cachePurgeList('facets')
  }

  itemDeleted (facet) {
    this.cachePurgeItem('facets', facet.id)
    this.cachePurgeList('facets')
  }
}

class Facets extends Query {
  getApi () {
    return ['getAll', 'get', 'save', 'delete']
  }

  createResource () {
    return new FacetsResource()
  }

  save (facet) {
    return super.save(facet, {wrapInDataProperty: false})
  }
}

export default new Facets()
