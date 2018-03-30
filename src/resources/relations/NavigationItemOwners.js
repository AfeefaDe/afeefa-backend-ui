import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Offer from '@/models/Offer'
import Resource from 'uidata/resource/Resource'

export default class NavigationItemOwnersResource extends Resource {
  getUrl () {
    const navigationItem = this.relation.owner
    return `fe_navigation/fe_navigation_items/${navigationItem.id}/owners`
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

    const navigationItem = this.relation.owner

    if (owner.hasOwnProperty('count_owners')) {
      navigationItem.count_owners += owner.count_owners
    } else {
      navigationItem.count_owners++
    }
  }

  itemDetached (owner) {
    super.itemDetached(owner)

    const navigationItem = this.relation.owner

    if (owner.hasOwnProperty('count_owners')) {
      navigationItem.count_owners -= owner.count_owners
    } else {
      navigationItem.count_owners--
    }
  }
}
