import Event from '@/models/Event'
import Orga from '@/models/Orga'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class TodosResource extends Resource {
  init () {
    this.url = 'todos'
    this.http = Vue.resource(BASE + this.url)
  }

  getListType (json) {
    return 'todos'
  }

  getItemJson (json) {
    return json.relationships.entry.data
  }

  getItemModel (json) {
    if (json.relationships.entry.data.type === 'orgas') {
      return Orga
    } else {
      return Event
    }
  }
}

class Todos extends Query {
  getApi () {
    return ['getAll']
  }

  createResource () {
    return new TodosResource()
  }
}

export default new Todos()
