import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class EventsResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'events{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'events'
  }

  createItem () {
    return new Event()
  }

  itemAdded (event) {
    const resourceCache = store.state.api.resourceCache
    // new event added to lists
    resourceCache.purgeList('events')
    resourceCache.purgeList('todos')
  }

  itemDeleted (event) {
    const resourceCache = store.state.api.resourceCache
    // remove old event from cache
    resourceCache.purgeItem('events', event.id)
    // old event not in lists any longer
    resourceCache.purgeList('events')
    resourceCache.purgeList('todos')
  }

  itemSaved (eventOld, event) {
    const resourceCache = store.state.api.resourceCache
    // event date might move the event from past to upcoming list
    resourceCache.purgeList('events')
    // annotation might be changed, entry may (disappear) in todo list
    resourceCache.purgeList('todos')
    // location or contact might be changed
    resourceCache.purgeItem('locations', eventOld.location.id)
    resourceCache.purgeItem('contacts', eventOld.contact.id)
  }

  itemAttributesUpdated (event, attributes) {
    Entries.updateAttributes(event, attributes)
  }
}

export default {
  getAllForOrga (id, filter) {
    const resource = new EventsResource()
    resource.http = Vue.resource(BASE + `orgas/${id}/events?filter[date]=${filter}`)
    resource.listCacheKey = `orgas/${id}/events?filter[date]=${filter}`
    return store.dispatch('api/getList', {resource}).then(events => {
      for (let event of events) {
        Entries.fetchCategory(event)
        Entries.fetchSubCategory(event)
      }
      return events
    })
  },

  getAll (params) {
    const resource = new EventsResource()
    return store.dispatch('api/getList', {resource, params}).then(events => {
      for (let event of events) {
        Entries.fetchCategory(event)
        Entries.fetchSubCategory(event)
      }
      return events
    })
  },

  get (id) {
    if (!id) {
      const event = Entries.create(new Event())
      return Promise.resolve(event)
    }
    const resource = new EventsResource()
    return store.dispatch('api/getItem', {resource, id}).then(event => {
      if (event) {
        Entries.fetchParentOrga(event)
        Entries.fetchCategory(event)
        Entries.fetchSubCategory(event)
        Entries.fetchLocation(event)
        Entries.fetchContact(event)
        Entries.fetchAnnotations(event)
      }
      return event
    })
  },

  clone (event) {
    return Entries.clone(event)
  },

  save (event) {
    if (event.id) {
      return store.dispatch('api/saveItem', {
        resource: new EventsResource(),
        item: event
      }).then(event => {
        // only update list for extisting parent_orgas
        if (event._relationIds.parent_orga) {
          const oldOrgaId = event._relationIds.parent_orga
          this.updateOrgaEventList(oldOrgaId)
        }
        if (event.parent_orga && event.parent_orga.id) {
          const currentOrgaId = event.parent_orga.id
          this.updateOrgaEventList(currentOrgaId)
        }
        return event
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new EventsResource(),
        item: event
      }).then(event => {
        // purge event list of orga of the new event
        this.updateOrgaEventList(event._relationIds.parent_orga)
        return event
      })
    }
  },

  updateOrgaEventList (orgaId) {
    if (orgaId) {
      const resourceCache = store.state.api.resourceCache
      resourceCache.purgeList(`orgas/${orgaId}/events?filter[date]=upcoming`)
      resourceCache.purgeList(`orgas/${orgaId}/events?filter[date]=past`)
    }
  },

  updateAttributes (event, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new EventsResource(),
      item: event,
      type: 'events',
      attributes
    })
  },

  delete (event) {
    return store.dispatch('api/deleteItem', {
      resource: new EventsResource(),
      item: event
    }).then(() => {
      if (event.parent_orga) {
        this.updateOrgaEventList(event.parent_orga.id)
      }
      return event
    })
  }
}
