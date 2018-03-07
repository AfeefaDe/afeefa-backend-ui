import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

class TodosResource extends Resource {
  url = 'todos'

  getListType (json) {
    return 'todos'
  }

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
}

export default new TodosResource()
