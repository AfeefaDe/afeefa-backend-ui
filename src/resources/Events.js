import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import EventsResource from './EventsResource'

class Events {
  getAllForOrga (id, filter) {
    const resource = new EventsResource()
    resource.http = Vue.resource(BASE + `orgas/${id}/events`)
    resource.listCacheKey = `events`
    resource.listCacheParams = JSON.stringify({orga_id: id, 'filter[date]': filter})
    const params = {
      'filter[date]': filter
    }
    return store.dispatch('api/getList', {resource, params})
  }

  getAll (params) {
    const resource = new EventsResource()
    return store.dispatch('api/getList', {resource, params})
  }

  get (id) {
    if (!id) {
      const event = new Event()
      return Promise.resolve(event)
    }
    const resource = new EventsResource()
    return store.dispatch('api/getItem', {resource, id}).then(event => {
      if (event) {
        event.fetchAnnotations()
        event.fetchContacts()
      }
      return event
    })
  }

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
  }

  updateAttributes (event, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new EventsResource(),
      item: event,
      type: 'events',
      attributes
    })
  }

  delete (event) {
    return store.dispatch('api/deleteItem', {
      resource: new EventsResource(),
      item: event
    })
  }
}

export default new Events()
