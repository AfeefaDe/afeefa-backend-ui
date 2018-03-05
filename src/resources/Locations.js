import Location from '@/models/Location'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class LocationsResource extends Resource {
  init () {
    this.url = 'locations{/id}'
    this.Model = Location
  }
}

class Locations extends Query {
  getApi () {
    return ['getAll']
  }

  getResource () {
    return new LocationsResource()
  }
}

export default new Locations()
