import MetaDataModel from '@/models/MetaData'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class MetaDataResource extends Resource {
  init () {
    this.url = 'meta'
    this.Model = MetaDataModel
  }

  getItemJson (json) {
    json.id = 'app'
    return json
  }
}

class MetaData extends Query {
  getResource () {
    return new MetaDataResource()
  }
}

export default new MetaData()
