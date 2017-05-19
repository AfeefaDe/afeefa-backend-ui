import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseResource from './base/BaseResource'

class OrgasResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'orgas{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'orgas'
  }

  createItem () {
    return new Orga()
  }
}


const Orgas = {
  getAll () {
    const resource = new OrgasResource()
    return store.dispatch('api/getList', {resource}).then(orgas => {
      for (let orga of orgas) {
        Entries.fetchCategory(orga)
        Entries.fetchSubCategory(orga)
      }
      return orgas
    })
  },

  get (id, fetchRelationsWhiteList = [
    'fetchParentOrga',
    'fetchCategory',
    'fetchSubCategory',
    'fetchLocation',
    'fetchContact',
    'fetchAnnotations',
    'fetchSubOrgas'
  ]) {
    if (!id) {
      const orga = Entries.create(new Orga())
      return Promise.resolve(orga)
    }
    const resource = new OrgasResource()
    return store.dispatch('api/getItem', {resource, id}).then(orga => {
      if (orga) {
        for (let fetchRelation of fetchRelationsWhiteList) {
          Entries[fetchRelation](orga)
        }
      }
      return orga
    })
  },

  clone (orga) {
    const clone = Entries.clone(orga)
    Entries.fetchSubOrgas(clone)
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

  updateAttributes (orga, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new OrgasResource(),
      id: orga.id,
      type: 'orgas',
      attributes
    }).then(attributes => {
      Entries.updateAttributes(orga, attributes)
      return attributes
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
