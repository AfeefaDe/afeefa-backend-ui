import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class SearchResource extends BaseResource {
  init ([keyword]) {
    this.listCacheKey = 'search' + keyword
    this.http = Vue.resource(BASE + 'entries?filter[title]=' + keyword)
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
  find (keyword) {
    const resource = new SearchResource(keyword)
    return store.dispatch('api/getList', {resource}).then(entries => {
      for (let entry of entries) {
        Entries.fetchCategory(entry)
        Entries.fetchSubCategory(entry)
      }
      return entries
    })
  }
}
