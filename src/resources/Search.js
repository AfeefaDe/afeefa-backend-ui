import Event from '@/models/Event'
import Orga from '@/models/Orga'
import store from '@/store'
import { BASE } from '@/store/api'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class SearchResource extends Resource {
  init () {
    this.url = 'entries'
    this.http = Vue.resource(BASE + this.url)
  }

  getSearchParams (searchRequest) {
    return {
      [`filter[${searchRequest.filterCriterion}]`]: searchRequest.keyword
    }
  }

  getListType (json) {
    return 'search'
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
  find (searchRequest) {
    const resource = new SearchResource()
    const params = resource.getSearchParams(searchRequest)
    return store.dispatch('api/getList', {resource, params})
  }
}
