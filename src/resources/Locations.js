import Location from '@/models/Location'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

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
