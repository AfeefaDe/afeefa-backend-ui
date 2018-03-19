import Resource from 'uidata/resource/Resource'

export default class OwnerFacetItemsResource extends Resource {
  itemAttached (facetItem) {
    super.itemAttached(facetItem)

    facetItem.$rels.owners.reloadOnNextGet()
    facetItem.count_owners++
  }

  itemDetached (facetItem) {
    super.itemDetached(facetItem)

    facetItem.$rels.owners.reloadOnNextGet()
    facetItem.count_owners--
  }
}
