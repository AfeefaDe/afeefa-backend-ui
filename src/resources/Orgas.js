import Vue from 'vue'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import EntriesResource from './base/EntriesResource'
import Query from './base/Query'

class OrgasResource extends EntriesResource {
  init () {
    this.url = 'orgas'
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})
    this.listType = 'orgas'
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
