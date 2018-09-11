import Event from '@/models/Event'
import Offer from '@/models/Offer'
import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

export default class ContactOwnerResource extends Resource {
  getItemModel (json) {
    if (json.type === 'orgas') {
      return Orga
    } else if (json.type === 'events') {
      return Event
    } else {
      return Offer
    }
  }
}
