import Orga from '@/models/Orga'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Vue from 'vue'

import EntriesResource from './base/EntriesResource'

class OrgasResource extends EntriesResource {
  init () {
    this.url = 'orgas{/id}'
    this.http = Vue.resource(BASE + this.url, {}, {update: {method: 'PATCH'}})
  }

  getItemModel () {
    return Orga
  }
}

class Orgas extends Query {
  getApi () {
    return super.getApi().concat(['joinActorRelation', 'leaveActorRelation'])
  }

  createResource () {
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
