import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

class SearchResource extends Resource {
  url = 'entries'

  getListType () {
    return 'search'
  }

  // entry is nested in search response relationships
  getItemJson (json) {
    return json.relationships.entry.data
  }

  getItemModel (json) {
    if (json.type === 'orgas') {
      return Orga
    } else {
      return Event
    }
  }

  find (searchRequest) {
    const params = {
      [`filter[${searchRequest.filterCriterion}]`]: searchRequest.keyword
    }
    return super.getAll(params)
  }
}

export default new SearchResource()
