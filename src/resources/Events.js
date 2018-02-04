import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Entries from './base/Entries'
import BaseEntriesResource from './base/BaseEntriesResource'

class EventsResource extends BaseEntriesResource {
  init () {
    this.http = Vue.resource(BASE + 'events{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'events'
  }

  createItem () {
    return new Event()
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
    const orgaId = event._relationIds.parent_orga
    if (orgaId) {
      this.cachePurgeList(`orgas/${orgaId}/events?filter[date]=upcoming`)
      this.cachePurgeList(`orgas/${orgaId}/events?filter[date]=past`)
    }
  }
}

export default {
  getAllForOrga (id, filter) {
    const resource = new EventsResource()
    resource.http = Vue.resource(BASE + `orgas/${id}/events`)
    resource.listCacheKey = `orgas/${id}/events`
    const params = {
      'filter[date]': filter
    }
    return store.dispatch('api/getList', {resource, params}).then(events => {
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
      const event = new Event()
      return Promise.resolve(event)
    }
    const resource = new EventsResource()
    return store.dispatch('api/getItem', {resource, id}).then(event => {
      if (event) {
        Entries.fetchParentOrga(event)
        Entries.fetchCategory(event)
        Entries.fetchSubCategory(event)
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
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new EventsResource(),
        item: event
      })
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
    })
  }
}
