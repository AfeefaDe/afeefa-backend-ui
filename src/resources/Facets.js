import Facet from '@/models/Facet'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class FacetsResource extends Resource {
  init () {
    this.url = 'facets{/id}'
    this.Model = Facet
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

  getResource () {
    return new FacetsResource()
  }

  save (facet) {
    return super.save(facet, {wrapInDataProperty: false})
  }
}

export default new Facets()
