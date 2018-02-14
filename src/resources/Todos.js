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

  getItemType (json) {
    return json.relationships.entry.data.type
  }

  getItemId (json) {
    return json.relationships.entry.data.id
  }

  getItemJson (json) {
    return json.relationships.entry.data
  }

  createItem (json) {
    if (json.relationships.entry.data.type === 'orgas') {
      return new Orga()
    } else {
      return new Event()
    }
  }
}

export default {
  getAll (params) {
    const resource = new TodosResource()
    // loading all todos should trigger loading all annotations
    // we are waiting till
    return store.dispatch('api/getList', {resource, params}).then(entries => {
      for (let entry of entries) {
        entry.fetchAnnotations()
      }
      return entries
    })
  }
}
