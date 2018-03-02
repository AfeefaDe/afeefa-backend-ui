import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class SearchResource extends Resource {
  init () {
    this.url = 'entries'
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
