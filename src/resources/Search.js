import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from './base/Resource'

class SearchResource extends Resource {
  init () {
    this.listCacheKey = 'search'
    this.http = Vue.resource(BASE + 'entries')
  }

  getSearchParams (searchRequest) {
    return {
      [`filter[${searchRequest.filterCriterion}]`]: searchRequest.keyword
    }
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

  deserializeItem (item, json) {
    item.deserialize(json.relationships.entry.data)
  }
}

export default {
  find (searchRequest) {
    const resource = new SearchResource()
    const params = resource.getSearchParams(searchRequest)

    return store.dispatch('api/getList', {resource, params}).then(entries => {
      for (let entry of entries) {
        entry.fetchParentOrga()
        entry.fetchCategory()
        entry.fetchSubCategory()
        entry.fetchCreator()
        entry.fetchLastEditor()
      }
      return entries
    })
  }
}
