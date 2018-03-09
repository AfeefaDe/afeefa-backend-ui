import ModelResource from 'uidata/resource/ModelResource'

export default class FacetsResource extends ModelResource {
  url = 'facets{/id}'

  itemDeleted (facet) {
    super.itemDeleted(facet)

    // find all facet_items that link to this facet
    // and order reload of the appropriate relation
    const facetItems = this.findCachedItemsBy('facet_items', {facet_id: facet.id})
    facetItems.forEach(facetItem => {
      facetItem.getParentRelations().forEach(relation => {
        relation.purgeFromCacheAndMarkInvalid()
      })
    })
  }
}
