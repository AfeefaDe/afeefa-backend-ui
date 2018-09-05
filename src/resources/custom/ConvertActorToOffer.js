import Offer from '@/models/Offer'
import Orga from '@/models/Orga'
import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class ConvertActorToOfferResource extends Resource {
  url = 'offers/convert_from_actor{/id}'

  constructor (actorId) {
    super()

    this.actorId = actorId
  }

  getListType () {
    return 'offers_convert'
  }

  getItemModel () {
    return Offer
  }

  ensureReverseRelationsAfterAddOrSave (offer) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(offer)
    // invalidate offer list
    ensure.reloadAlways(App.getRelationByModel(Offer))

    // remove orga references
    const actor = Orga.Query.find(this.actorId)
    if (actor) {
      Orga.Query.itemDeleted(actor)
    }

    return ensure
  }
}
