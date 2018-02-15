import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import OrgasResource from './OrgasResource'
import toCamelCase from '@/filters/camel-case'
import LoadingStrategy from '@/store/api/LoadingStrategy'

class Orgas {
  constructor () {
    this.relationsToFetch = []
  }

  with (...relations) {
    const OrgasCopy = new Orgas()
    OrgasCopy.relationsToFetch = relations
    return OrgasCopy
  }

  getAll () {
    const resource = new OrgasResource()
    return store.dispatch('api/getList', {resource})
  }

  get (id, relations, strategy, fetchingStrategies = {}) {
    if (!id) {
      const orga = new Orga()
      return Promise.resolve(orga)
    }
    const resource = new OrgasResource()
    return store.dispatch('api/getItem', {resource, id, strategy}).then(orga => {
      if (orga) {
        if (this.relationsToFetch) {
          this.relationsToFetch.forEach(relationName => {
            const fetchFunction = 'fetch' + toCamelCase(relationName)
            if (!orga[fetchFunction]) {
              console.error('Method to fetch a relation is not defined:', fetchFunction, this.info)
            }
            orga[fetchFunction](LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED)
          })
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
