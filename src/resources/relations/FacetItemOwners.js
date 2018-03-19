import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

export default class FacetItemOwnersResource extends Resource {
  getUrl () {
    const facetItem = this.relation.owner
    return `${facetItem.facet.type}/${facetItem.facet.id}/${facetItem.type}/${facetItem.id}/owners`
  }

  getListType () {
    return 'owners'
  }

  getItemModel (json) {
    if (json.type === 'orgas') {
      return Orga
    } else {
      return Event
    }
  }
}
