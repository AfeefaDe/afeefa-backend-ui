import Resource from 'uidata/resource/Resource'

export default class FacetsResource extends Resource {
  url = 'facets{/id}'

  itemDeleted (facet) {
    super.itemDeleted(facet)

    // find all facet_items that link to this facet
    // and order reload of the appropriate relation
    // e.g. event.$rels.facet_items
    facet.facet_items.forEach(facetItem => {
      facetItem.getParentRelations().forEach(relation => {
        relation.reloadOnNextGet()
      })
    })
  }
}
