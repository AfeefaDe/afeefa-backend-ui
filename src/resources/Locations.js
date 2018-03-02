import Location from '@/models/Location'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class LocationsResource extends Resource {
  init () {
    this.url = 'locations{/id}'
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
