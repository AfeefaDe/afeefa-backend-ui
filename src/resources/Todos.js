import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class TodosResource extends BaseResource {
  init () {
    this.listCacheKey = 'todos'
    this.http = Vue.resource(BASE + 'todos')
  }

  getItemCacheKey (json) {
    // @question: what should be returned here ? json.type used to be 'todo'
    return json.type
  }

  createItem (json) {
    // workaround for issue #149
    if (!json) {
      return null
    } else if (json.type === 'orgas') {
      return new Orga()
    } else {
      return new Event()
    }
  }

  deserialize (item, json) {
    // workaround for issue #149
    if (item) {
      item.deserialize(json)
    }
  }
}

export default {
  getAll (params) {
    const resource = new TodosResource()
    return store.dispatch('api/getList', {resource, params}).then(entries => {
      for (let entry of entries) {
        Entries.fetchCategory(entry)
        Entries.fetchSubCategory(entry)
      }
      return entries
    })
  }
}
