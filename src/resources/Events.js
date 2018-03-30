import EntriesResource from './base/Entries'

export default class EventsResource extends EntriesResource {
  url = 'events{/id}'

  itemDeleted (event) {
    super.itemDeleted(event)

    if (event.parent_orga) {
      event.parent_orga.count_events--
    }
  }

  itemSaved (eventOld, event) {
    super.itemSaved(eventOld, event)

    // upcoming changed
    if (eventOld.isUpcoming !== event.isUpcoming) {
      this.cachePurgeList('events', '{}')

      event.parent_orga.$rels.upcoming_events.reloadOnNextGet()
      event.parent_orga.$rels.past_events.reloadOnNextGet()
    }

    // parent orga changed
    if (eventOld.parent_orga !== event.parent_orga) {
      if (eventOld.parent_orga) {
        eventOld.parent_orga.count_events--
        eventOld.parent_orga.$rels.upcoming_events.reloadOnNextGet()
        eventOld.parent_orga.$rels.past_events.reloadOnNextGet()
      }
      if (event.parent_orga) {
        // current parent_orga.count_events loaded in event save payload
        event.parent_orga.$rels.upcoming_events.reloadOnNextGet()
        event.parent_orga.$rels.past_events.reloadOnNextGet()
      }
    }
  }
}
