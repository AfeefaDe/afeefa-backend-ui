import Location from '@/models/Location'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

class LocationsResource extends Resource {
  init () {
    this.url = 'locations{/id}'
    this.Model = Location
  }
}

class Locations extends Query {
  getResource () {
    return new LocationsResource()
  }
}

export default new Locations()
