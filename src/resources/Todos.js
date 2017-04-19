import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class TodosResource extends BaseResource {
  init (keyword) {
    this.listCacheKey = 'todos'
    this.http = Vue.resource(BASE + 'todos')
  }

  getItemCacheKey (json) {
    return json.type
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
  getAll () {
    const resource = new TodosResource()
    return store.dispatch('api/getList', resource).then(entries => {
      for (let entry of entries) {
        Entries.fetchCategory(entry)
        Entries.fetchSubCategory(entry)
        Entries.fetchAnnotations(entry)
      }
      return entries
    })
  }
}
