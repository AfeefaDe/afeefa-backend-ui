import App from 'uidata/model/App'

import EntriesResource from './base/Entries'

export default class EventsResource extends EntriesResource {
  url = 'events{/id}'

  ensureReverseRelations (event) {
    const reverseRelations = super.ensureReverseRelations(event)

    // host.events
    event.hosts.forEach(actor => {
      if (event.isUpcoming) {
        reverseRelations.add(actor.$rels.upcoming_events)
      } else {
        reverseRelations.add(actor.$rels.past_events)
      }
    })

    // app.events
    if (event.isUpcoming) {
      reverseRelations.add(App.getRelationByType('events'), 'upcoming')
    } else {
      reverseRelations.add(App.getRelationByType('events'), 'past')
    }

    return reverseRelations
  }

  itemDeleted (event) {
    super.itemDeleted(event)

    event.hosts.forEach(host => {
      host.count_events--
    })
  }
}
