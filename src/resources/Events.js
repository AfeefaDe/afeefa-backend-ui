import Event from '@/models/Event'
import Query from 'data/resource/Query'

import EntriesResource from './base/EntriesResource'

class EventsResource extends EntriesResource {
  init (relation) {
    this.url = relation ? `orgas/${relation.owner.id}/events` : 'events{/id}'
  }

  getItemModel () {
    return Event
  }

  itemAdded (event) {
    super.itemAdded(event)
    // parent orgas events might change
    this._updateParentOrgasEventList(event)
  }

  itemDeleted (event) {
    super.itemDeleted(event)
    // parent orgas events might change
    this._updateParentOrgasEventList(event)
  }

  itemSaved (eventOld, event) {
    super.itemSaved(eventOld, event)
    // parent orgas events might change
    this._updateParentOrgasEventList(eventOld)
    this._updateParentOrgasEventList(event)
  }

  _updateParentOrgasEventList (event) {
    const orgaId = event.relation('parent_orga').id
    if (orgaId) {
      this.cachePurgeList('events', JSON.stringify({owner_type: 'orgas', owner_id: orgaId, 'filter[date]': 'upcoming'}))
      this.cachePurgeList('events', JSON.stringify({owner_type: 'orgas', owner_id: orgaId, 'filter[date]': 'past'}))
    }
  }
}

class Events extends Query {
  createResource ({relation}) {
    return new EventsResource(relation)
  }

  get (id, strategy) {
    // Todo remove this fallback as it causes uncertainty
    if (!id) {
      const model = new Event()
      return Promise.resolve(model)
    }
    return super.get(id, strategy)
  }
}

export default new Events()
