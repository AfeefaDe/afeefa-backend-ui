import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class SearchResource extends BaseResource {
  init ([searchRequest]) {
    const filterUrl = this.generateFilterUrl(searchRequest)
    this.listCacheKey = 'search' + filterUrl
    this.http = Vue.resource(BASE + filterUrl)
  }

  generateFilterUrl (searchRequest) {
    let url = 'entries'
    for (let i in searchRequest) {
      const filter = 'filter[' + searchRequest[i].filterCriterion + ']=' + searchRequest[i].keyword
      if (i === '0') {
        url += '?' + filter
      } else {
        url += '&' + filter
      }
    }
    return url
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
  find (searchRequest) {
    const resource = new SearchResource(searchRequest)
    return store.dispatch('api/getList', {resource}).then(entries => {
      for (let entry of entries) {
        Entries.fetchCategory(entry)
        Entries.fetchSubCategory(entry)
      }
      return entries
    })
  }
}
