import Facet from '@/models/Facet'
import Resource from 'uidata/resource/Resource'

export default class FacetsResource extends Resource {
  url = 'facets{/id}'

  get (id) {
    return Facet.Query.getAll().then(() => {
      return super.get(id)
    })
  }
}
