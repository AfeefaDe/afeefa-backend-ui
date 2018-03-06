import EntriesResource from './base/EntriesResource'

export default class EventsResource extends EntriesResource {
  url = 'events{/id}'

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
