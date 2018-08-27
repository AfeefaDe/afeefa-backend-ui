import Facet from '@/models/Facet'
import LoadingState from 'afeefa-ui-data/lib/api/LoadingState'
import Resource from 'uidata/resource/Resource'

export default class FacetsResource extends Resource {
  url = 'facets{/id}'

  get (id) {
    return Facet.Query.getAll().then(() => {
      return super.get(id)
    })
  }

  listLoaded (facets) {
    super.listLoaded(facets)

    // facet lists loads all facets with complete data
    // getting a facet by id should not reload facet from server
    facets.forEach(facet => {
      facet._loadingState = LoadingState.FULLY_LOADED
    })
  }

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
