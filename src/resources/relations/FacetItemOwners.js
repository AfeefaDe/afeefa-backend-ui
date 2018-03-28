import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Offer from '@/models/Offer'
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
    } else if (json.type === 'events') {
      return Event
    } else {
      return Offer
    }
  }

  serializeAttachOrDetachMany (models) {
    return {
      owners: models.map(model => ({
        owner_type: model.type,
        owner_id: model.id
      }))
    }
  }

  serializeAttachOrDetach (model) {
    return {
      owner_type: model.type,
      owner_id: model.id
    }
  }

  itemAttached (owner) {
    super.itemAttached(owner)

    owner.$rels.facet_items.reloadOnNextGet()
    const facetItem = this.relation.owner
    facetItem.count_owners++
  }

  itemDetached (owner) {
    super.itemDetached(owner)

    owner.$rels.facet_items.reloadOnNextGet()
    const facetItem = this.relation.owner
    facetItem.count_owners--
  }
}
