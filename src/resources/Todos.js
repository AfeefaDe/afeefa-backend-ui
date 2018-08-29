import Event from '@/models/Event'
import Orga from '@/models/Orga'
import Resource from 'uidata/resource/Resource'

class TodosResource extends Resource {
  url = 'todos{?ids}'

  lazyLoadList = true

  getListType () {
    return 'todos'
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
