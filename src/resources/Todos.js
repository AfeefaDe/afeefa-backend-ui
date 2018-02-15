import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from './base/Resource'

class TodosResource extends Resource {
  init () {
    this.url = 'todos'
    this.http = Vue.resource(BASE + this.url)

    this.listType = 'todos'
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

export default {
  getAll (params) {
    const resource = new TodosResource()
    return store.dispatch('api/getList', {resource, params})
  }
}
