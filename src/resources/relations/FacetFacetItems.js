import RelationQuery from 'data/resource/RelationQuery'

export default class FacetFacetItems extends RelationQuery {
  getSaveOptions () {
    return {
      wrapInDataProperty: false
    }
  }

  // todo, itemDeleted
  // -  itemDeleted (facetItem) {
  //   -    // order reload of the facets facet_items by the next get() call
  //   -    this.cachePurgeRelation(this.owner.$rels.facet_items)
  //   -    // order reload of the entries facet items by the next get() call
  //   -    // TODO
  //   -    // remove the facet item from cache
  //   -    this.cachePurgeItem('facet_items', facetItem.id)
  //   -  }
}
