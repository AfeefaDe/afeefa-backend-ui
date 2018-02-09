import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import OrgasResource from './OrgasResource'

class Orgas {
  getAll () {
    const resource = new OrgasResource()
    return store.dispatch('api/getList', {resource}).then(orgas => {
      for (let orga of orgas) {
        orga.fetchParentOrga()
        orga.fetchCategory()
        orga.fetchSubCategory()
      }
      return orgas
    })
  }

  /**
   * Orgas.get(id) - fetch all relations, fetch parent orga with cached_or_load
   * Orgas.get(id, null) - fetch all relations, fetch parent orga with cached_or_load
   * Orgas.get(id, []) - fetch no relation
   * Orgas.get(id, [], strategy) - fetch no relation, use specific loading strategy
   * Orgas.get(id, null, null, fetchingStrategies) - fetch all and apply custom loading strategies to specific relations
   */
  get (id, relations, strategy, fetchingStrategies = {}) {
    if (!id) {
      const orga = new Orga()
      return Promise.resolve(orga)
    }

    const fetchRelations = relations || [
      'fetchParentOrga',
      'fetchCategory',
      'fetchSubCategory',
      'fetchAnnotations',
      'fetchContacts',
      'fetchResources',
      'fetchActorRelations'
    ]

    const resource = new OrgasResource()
    return store.dispatch('api/getItem', {resource, id, strategy}).then(orga => {
      if (orga) {
        for (let fetchRelation of fetchRelations) {
          const strategy = fetchingStrategies[fetchRelation] || null
          orga[fetchRelation](strategy)
        }
      }
      return orga
    })
  }

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
  }

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
  }

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
  }

  updateAttributes (orga, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: new OrgasResource(),
      item: orga,
      type: 'orgas',
      attributes
    })
  }

  delete (orga) {
    return store.dispatch('api/deleteItem', {
      resource: new OrgasResource(),
      item: orga
    })
  }
}

export default new Orgas()
