import Event from '@/models/Event'
import Query from 'uidata/resource/Query'

import EntriesResource from './base/EntriesResource'

class EventsResource extends EntriesResource {
  init () {
    this.url = 'events{/id}'
    this.Model = Event
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
    const orgaId = event.$rels.parent_orga.id
    if (orgaId) {
      this.cachePurgeList('events', JSON.stringify({owner_type: 'orgas', owner_id: orgaId, 'filter[date]': 'upcoming'}))
      this.cachePurgeList('events', JSON.stringify({owner_type: 'orgas', owner_id: orgaId, 'filter[date]': 'past'}))
    }
  }
}

class Events extends Query {
  getResource () {
    return new EventsResource()
  }
}

export default new Events()
