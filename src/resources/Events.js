import App from 'uidata/model/App'

import EntriesResource from './base/Entries'

export default class EventsResource extends EntriesResource {
  url = 'events{/id}{?ids}'

  lazyLoadList = true

  ensureReverseRelationsAfterAddOrSave (event) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(event)

    // app.events
    if (event.isUpcoming) {
      ensure.add(App.getRelationByType('events'), 'upcoming')
    } else {
      ensure.add(App.getRelationByType('events'), 'past')
    }

    return ensure
  }
}
