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
      facet.loadingState = LoadingState.FULLY_LOADED
    })
  }
}
