import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import EventsResource from './EventsResource'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import toCamelCase from '@/filters/camel-case'

class Events {
  constructor () {
    this.relationsToFetch = []
  }

  with (...relations) {
    const EventsCopy = new Events()
    EventsCopy.relationsToFetch = relations
    return EventsCopy
  }

  getAllForOrga (id, filter) {
    const resource = new EventsResource()
    resource.url = `orgas/${id}/events`
    resource.http = Vue.resource(BASE + resource.url)
    resource.listType = `events`
    resource.listParams = {orga_id: id, 'filter[date]': filter}

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
        if (this.relationsToFetch) {
          this.relationsToFetch.forEach(relationName => {
            const fetchFunction = 'fetch' + toCamelCase(relationName)
            if (!event[fetchFunction]) {
              console.error('Method to fetch a relation is not defined:', fetchFunction, this.info)
            }
            event[fetchFunction](LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED)
          })
        }
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
