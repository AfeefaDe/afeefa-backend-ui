import Vue from 'vue'
import { BASE } from '@/store/api'
import Location from '@/models/Location'
import Resource from './base/Resource'
import Query from './base/Query'

class LocationsResource extends Resource {
  init () {
    this.url = 'locations'
    this.http = Vue.resource(BASE + this.url + '{/id}')
  }

  getItemModel () {
    return Location
  }
}

class Locations extends Query {
  getApi () {
    return ['get', 'getAll']
  }

  createResource () {
    return new LocationsResource()
  }
}

export default new Locations()
