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
    'fetchAnnotations'
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

  joinActorRelation (relationType, relatingOrga, relatedOrga) {
    const resource = Vue.resource(BASE + `orgas{/relating_id}/${relationType}{/related_id}`)
    return resource.save({
      relating_id: relatingOrga.id,
      related_id: relatedOrga.id
    }, {}).then(() => {
      const resourceCache = store.state.api.resourceCache
      resourceCache.purgeItem('orgas', relatingOrga.id)
      resourceCache.purgeItem('orgas', relatedOrga.id)
      return true
    }).catch(response => {
      store.dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Hinzufügen',
        description: `Die Orga ${relatedOrga.title} konnte nicht hinzugefügt werden.`
      }, {root: true})
      console.log('error join actor relation', response)
      return null
    })
  },

  leaveActorRelation (relationType, relatingOrga, relatedOrga) {
    const resource = Vue.resource(BASE + `orgas{/relating_id}/${relationType}{/related_id}`)
    return resource.delete({
      relating_id: relatingOrga.id,
      related_id: relatedOrga.id
    }, {}).then(() => {
      const resourceCache = store.state.api.resourceCache
      resourceCache.purgeItem('orgas', relatingOrga.id)
      resourceCache.purgeItem('orgas', relatedOrga.id)
      return true
    }).catch(response => {
      store.dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Entfernen',
        description: 'Der Orga konnte nicht entfernt werden.'
      }, {root: true})
      console.log('error leave actor relation', response)
      return null
    })
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
