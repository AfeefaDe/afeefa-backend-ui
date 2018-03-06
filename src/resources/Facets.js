import Resource from 'uidata/resource/Resource'

export default class FacetsResource extends Resource {
  url = 'facets{/id}'

  itemAdded () {
    this.cachePurgeList('facets')
  }

  itemDeleted (facet) {
    this.cachePurgeItem('facets', facet.id)
    this.cachePurgeList('facets')
  }
}

