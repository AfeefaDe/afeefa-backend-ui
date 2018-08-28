import Resource from 'uidata/resource/Resource'

export default class FacetFacetItemsResource extends Resource {
  ensureReverseRelationsAfterAddOrSave (facetItem) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(facetItem)
    ensure.reloadAlways(facetItem.facet.$rels.facet_items)
    return ensure
  }
}
