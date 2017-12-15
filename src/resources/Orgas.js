import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import BaseEntriesResource from './base/BaseEntriesResource'

class OrgasResource extends BaseEntriesResource {
  init () {
    this.http = Vue.resource(BASE + 'orgas{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'orgas'
  }

  createItem () {
    return new Orga()
  }

  itemAdded (orga) {
    super.itemAdded(orga)
    // parent orgas sub orgas might change
    if (orga._relationIds.parent_orga) {
      this.cachePurgeItem('orgas', orga._relationIds.parent_orga)
    }
  }

  itemDeleted (orga) {
    super.itemDeleted(orga)
    // parent orgas sub orgas might change
    if (orga._relationIds.parent_orga) {
      this.cachePurgeItem('orgas', orga._relationIds.parent_orga)
    }
  }

  itemSaved (orgaOld, orga) {
    super.itemSaved(orgaOld, orga)
    // parent orgas sub orgas might change
    if (orgaOld._relationIds.parent_orga) {
      this.cachePurgeItem('orgas', orgaOld._relationIds.parent_orga)
    }
    if (orga._relationIds.parent_orga) {
      this.cachePurgeItem('orgas', orga._relationIds.parent_orga)
    }
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

  getAllSimplified () {
    return this.getAll().then(orgas => {
      return orgas.map((orga) => {
        return {title: orga.title, id: orga.id}
      })
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
        // only fetch Resources when there are unloaded id's in the _relationIds attribute
        if (orga._relationIds.resource_items.length) {
          fetchRelationsWhiteList.push('fetchResources')
        }
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
    Entries.fetchResources(clone)
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
      item: orga,
      type: 'orgas',
      attributes
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
