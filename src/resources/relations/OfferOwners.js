import Resource from 'uidata/resource/Resource'

export default class OfferOwnersResource extends Resource {
  getUrl () {
    const offer = this.relation.owner
    return `${offer.type}/${offer.id}/owners`
  }

  serializeAttachOrDetachMany (models) {
    return {
      actors: models.map(model => model.id)
    }
  }

  itemAttached (owner) {
    super.itemAttached(owner)
    owner.count_offers++
  }

  itemDetached (owner) {
    super.itemDetached(owner)
    owner.count_offers--
  }
}
