import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class OrgasResource extends BaseResource {
  init () {
    this.api_type = 'orgas'
    this.http = Vue.resource(BASE + 'orgas{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'orgas'
  }

  createItem () {
    return new Orga()
  }
}


const fetchSubOrgas = orga => {
  // do not fetch sub orgas multiple times
  if (orga.sub_orgas.__isLoading) {
    return
  }

  for (let id of orga._relationIds.sub_orgas) {
    Orgas.get(id).then(subOrga => {
      if (subOrga) {
        orga.sub_orgas.push(subOrga)
      }
    })
  }

  orga.sub_orgas.__isLoading = true
}


const Orgas = {
  getAll () {
    const resource = new OrgasResource()
    return store.dispatch('api/getList', resource).then(orgas => {
      for (let orga of orgas) {
        Entries.fetchCategory(orga)
        Entries.fetchSubCategory(orga)
      }
      return orgas
    })
  },

  get (id) {
    if (!id) {
      const orga = Entries.create(new Orga())
      return Promise.resolve(orga)
    }
    const resource = new OrgasResource()
    return store.dispatch('api/getItem', {resource, id}).then(orga => {
      if (orga) {
        Entries.fetchParentOrga(orga)
        Entries.fetchCategory(orga)
        Entries.fetchSubCategory(orga)
        Entries.fetchLocation(orga)
        Entries.fetchContact(orga)
        Entries.fetchAnnotations(orga)
        fetchSubOrgas(orga)
      }
      return orga
    })
  },

  clone (orga) {
    const clone = Entries.clone(orga)
    fetchSubOrgas(clone)
    return clone
  },

  save (orga) {
    if (orga.id) {
      return store.dispatch('api/saveItem', {
        resource: new OrgasResource(),
        item: orga
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new OrgasResource(),
        item: orga
      })
    }
  },

  updateAttributes (id, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new OrgasResource(), id, attributes
    })
  },

  delete (orga) {
    return store.dispatch('api/deleteItem', {
      resource: new OrgasResource(),
      item: orga
    })
  }
}

export default Orgas
