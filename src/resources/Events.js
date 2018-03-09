import EntriesResource from './base/EntriesResource'

export default class EventsResource extends EntriesResource {
  url = 'events{/id}'

  itemAdded (event) {
    super.itemAdded(event)
    // parent orgas events might change
    this.updateParentOrgasEventList(event)
  }

  itemDeleted (event) {
    super.itemDeleted(event)

    event.getParentRelations().forEach(relation => {
      relation.purgeFromCacheAndMarkInvalid()
    })
  }

  itemSaved (eventOld, event) {
    super.itemSaved(eventOld, event)

    eventOld.getParentRelations().forEach(relation => {
      relation.purgeFromCacheAndMarkInvalid()
    })

    event.getParentRelations().forEach(relation => {
      relation.purgeFromCacheAndMarkInvalid()
    })
  }

  updateParentOrgasEventList (event) {
    const orga = event.$rels.parent_orga.Query.find()
    if (orga) {
      orga.$rels.past_events.purgeFromCacheAndMarkInvalid()
      orga.$rels.upcoming_events.purgeFromCacheAndMarkInvalid()
    }
  }
}
