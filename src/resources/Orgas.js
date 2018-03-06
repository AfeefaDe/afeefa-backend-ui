import Orga from '@/models/Orga'
import Query from 'uidata/resource/Query'

import EntriesResource from './base/EntriesResource'

class OrgasResource extends EntriesResource {
  init () {
    this.url = 'orgas{/id}'
    this.Model = Orga
  }
}

class Orgas extends Query {
  getResource () {
    return new OrgasResource()
  }
}

export default new Orgas()
