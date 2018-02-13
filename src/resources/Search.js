import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from './base/Resource'

class SearchResource extends Resource {
  init () {
    this.listType = 'search'
    this.http = Vue.resource(BASE + 'entries')
  }

  getSearchParams (searchRequest) {
    return {
      [`filter[${searchRequest.filterCriterion}]`]: searchRequest.keyword
    }
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
  find (searchRequest) {
    const resource = new SearchResource()
    const params = resource.getSearchParams(searchRequest)
    return store.dispatch('api/getList', {resource, params})
  }
}
