import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Query from '@/resources/base/Query'
import { BASE } from '@/store/api'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class SearchResource extends Resource {
  init () {
    this.url = 'entries'
    this.http = Vue.resource(BASE + this.url)
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

class Search extends Query {
  getApi () {
    return ['find']
  }

  createResource () {
    return new SearchResource()
  }

  find (searchRequest) {
    const params = {
      [`filter[${searchRequest.filterCriterion}]`]: searchRequest.keyword
    }
    return super.getAll(params)
  }
}

export default new Search()
