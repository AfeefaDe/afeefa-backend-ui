import MetaDataModel from '@/models/MetaData'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class MetaDataResource extends Resource {
  init () {
    this.url = 'meta'
  }

  getItemJson (json) {
    json.id = 'app'
    return json
  }

  getItemModel () {
    return MetaDataModel
  }
}

class MetaData extends Query {
  getApi () {
    return ['get']
  }

  createResource () {
    return new MetaDataResource()
  }
}

export default new MetaData()
