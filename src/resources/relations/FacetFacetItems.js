import Resource from 'uidata/resource/Resource'

export default class FacetFacetItemsResource extends Resource {
  // item might be moved
  itemSaved (oldFacetItem, facetItem) {
    super.itemSaved(oldFacetItem, facetItem)

    this.relation.reloadOnNextGet()
  }
}
