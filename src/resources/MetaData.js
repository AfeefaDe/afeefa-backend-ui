import MetaDataModel from '@/models/MetaData'
import { BASE } from '@/store/api'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

import Query from './base/Query'

class MetaDataResource extends Resource {
  init () {
    this.url = 'meta'
    this.http = Vue.resource(BASE + this.url)
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
