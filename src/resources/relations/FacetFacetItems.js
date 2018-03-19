import Resource from 'uidata/resource/Resource'

export default class FacetFacetItemsResource extends Resource {
  itemSaved (oldFacetItem, facetItem) {
    super.itemSaved(oldFacetItem, facetItem)

    // reload facet's facet_items
    this.relation.reloadOnNextGet()

    // facet item moved -> reload all facets
    if (oldFacetItem.facet.id !== facetItem.facet.id) {
      this.cachePurgeList('facets')
    }
  }
}
