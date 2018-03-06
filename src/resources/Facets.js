import Facet from '@/models/Facet'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

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
  getResource () {
    return new FacetsResource()
  }

  save (facet) {
    return super.save(facet, {wrapInDataProperty: false})
  }
}

export default new Facets()
