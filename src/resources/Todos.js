import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

class TodosResource extends Resource {
  init () {
    this.url = 'todos'
  }

  getListType (json) {
    return 'todos'
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

class Todos extends Query {
  getResource () {
    return new TodosResource()
  }
}

export default new Todos()
