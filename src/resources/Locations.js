import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Location from '@/models/Location'
import BaseResource from './base/BaseResource'

class LocationsResource extends BaseResource {
  init () {
    this.api_type = 'locations'
    this.http = Vue.resource(BASE + 'locations{/id}')
    this.listCacheKey = 'locations'
  }

  createItem () {
    return new Location()
  }
}

export default {
  get (id) {
    const resource = new LocationsResource()
    return store.dispatch('api/getItem', {resource, id})
  }
}