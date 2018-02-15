import Vue from 'vue'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import EntriesResource from './base/EntriesResource'

export default class EventsResource extends EntriesResource {
  init () {
    this.url = 'events'
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})

    this.listType = 'events'
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
      this.cachePurgeList('events', JSON.stringify({orga_id: orgaId, 'filter[date]': 'upcoming'}))
      this.cachePurgeList('events', JSON.stringify({orga_id: orgaId, 'filter[date]': 'past'}))
    }
  }
}
