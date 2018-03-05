import Orga from '@/models/Orga'
import Query from 'data/resource/Query'

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

  get (id, strategy) {
    // Todo remove this fallback as it causes uncertainty
    if (!id) {
      const model = new Orga()
      return Promise.resolve(model)
    }
    return super.get(id, strategy)
  }
}

export default new Orgas()
