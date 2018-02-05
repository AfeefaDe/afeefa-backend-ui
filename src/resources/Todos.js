import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'
import Annotations from './Annotations'

class TodosResource extends BaseResource {
  init () {
    this.listCacheKey = 'todos'
    this.http = Vue.resource(BASE + 'todos')
  }

  getItemCacheKey (json) {
    return json.relationships.entry.data.type
  }

  getItemCacheId (json) {
    return json.relationships.entry.data.id
  }

  createItem (json) {
    if (json.relationships.entry.data.type === 'orgas') {
      return new Orga()
    } else {
      return new Event()
    }
  }

  deserialize (item, json) {
    item.deserialize(json.relationships.entry.data)
  }
}

export default {
  async getAll (params) {
    const resource = new TodosResource()
    // loading all todos should trigger loading all annotations
    // we are waiting till
    await Annotations.getAll()
    return store.dispatch('api/getList', {resource, params}).then(entries => {
      for (let entry of entries) {
        Entries.fetchCategory(entry)
        Entries.fetchSubCategory(entry)
        // attaching the already loaded annotation to the Entry
        Entries.fetchAnnotations(entry)
      }
      return entries
    })
  }
}
