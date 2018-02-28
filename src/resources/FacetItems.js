import FacetItem from '@/models/FacetItem'
import { BASE } from '@/store/api'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

import Query from './base/Query'

class FacetItemsResource extends Resource {
  init (owner) {
    this.owner = owner

    this.url = `${owner.type}/${owner.id}/facet_items`
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})

    this.listParams = owner.relation('facet_items').listParams()
  }

  getItemModel () {
    return FacetItem
  }

  itemAdded (facetItem) {
    this.cachePurgeItem('facet_items', facetItem.id)
    this.cachePurgeItem('facets', this.owner.id)
  }

  itemDeleted (facetItem) {
    this.cachePurgeItem('facet_items', facetItem.id)
    this.cachePurgeItem('facets', this.owner.id)
  }
}

class Facets extends Query {
  getApi () {
    return ['forOwner', 'save', 'delete']
  }

  createResource ({owner}) {
    return new FacetItemsResource(owner)
  }

  save (facet) {
    return super.save(facet, {wrapInDataProperty: false})
  }
}

export default new Facets()
