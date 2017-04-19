import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class EventsResource extends BaseResource {
  init () {
    this.api_type = 'events'
    this.http = Vue.resource(BASE + 'events{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'events'
  }

  createItem () {
    return new Event()
  }
}

export default {
  getAllForOrga (id) {
    const resource = new EventsResource()
    resource.http = Vue.resource(BASE + `orgas/${id}/events`)
    resource.listCacheKey = `orgas/${id}/events`
    return store.dispatch('api/getList', resource).then(events => {
      for (let event of events) {
        Entries.fetchCategory(event)
        Entries.fetchSubCategory(event)
      }
      return events
    })
  },

  getAll () {
    const resource = new EventsResource()
    return store.dispatch('api/getList', resource).then(events => {
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
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new EventsResource(),
        item: event
      })
    }
  },

  updateAttributes (id, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new EventsResource(), id, attributes
    })
  },

  delete (event) {
    return store.dispatch('api/deleteItem', {
      resource: new EventsResource(),
      item: event
    })
  }
}
