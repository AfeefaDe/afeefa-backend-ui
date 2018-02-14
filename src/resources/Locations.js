import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Location from '@/models/Location'
import Resource from './base/Resource'

class LocationsResource extends Resource {
  init () {
    this.url = 'locations'
    this.http = Vue.resource(BASE + this.url + '{/id}')

    this.listType = 'locations'
  }

  createItem () {
    return new Location()
  }
}

export default {
  getAll () {
    const resource = new LocationsResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new LocationsResource()
    return store.dispatch('api/getItem', {resource, id})
  }
}
