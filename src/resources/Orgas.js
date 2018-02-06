import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import Orga from '@/models/Orga'
import Entries from './base/Entries'
import ActorRelations from './ActorRelations'
import BaseEntriesResource from './base/BaseEntriesResource'
import ActorRelationsModel from '@/models/ActorRelations'

class OrgasResource extends BaseEntriesResource {
  init () {
    this.http = Vue.resource(BASE + 'orgas{/id}', {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'orgas'
  }

  createItem () {
    return new Orga()
  }

  itemSaved (orgaOld, orga) {
    super.itemSaved(orgaOld, orga)

    // refetch relations to this orga
    const allActorRelations = this.cacheGetAllItems('actor_relations')
    for (let orgaId in allActorRelations) {
      this.cachePurgeItem('actor_relations', orgaId)
      const relatedOrga = this.findCachedItem('orgas', orgaId)
      relatedOrga.invalidateLoadedActorRelations()
    }
  }

  initEagerLoadedRelations (orga) {
    super.initEagerLoadedRelations(orga)

    // loaded actor relations
    const actorRelations = new ActorRelationsModel()
    actorRelations.id = orga.id
    actorRelations.deserialize(orga._eagerLoadedRelations.actorRelations)
    ActorRelations.initActorRelations(orga.id, actorRelations)
  }
}

const Orgas = {
  /**
   * Initializes an eagerly loaded related orga
   */
  initOrga (orgaJson, loadingState) {
    if (orgaJson) {
      const resourceCache = store.state.api.resourceCache
      let orga = resourceCache.getItem('orgas', orgaJson.id)
      if (!orga) {
        orga = new Orga()
        orga.deserialize(orgaJson)
        orga._loadingState = loadingState
        resourceCache.addItem('orgas', orga)
      } else {
        if (orga._loadingState < loadingState) {
          orga.deserialize(orgaJson)
          orga._loadingState = loadingState
        }
      }
      return orga
    }
  },

  getAll () {
    const resource = new OrgasResource()
    return store.dispatch('api/getList', {resource}).then(orgas => {
      for (let orga of orgas) {
        Entries.fetchParentOrga(orga, LoadingStrategy.RETURN_CACHED_OR_LOAD)
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
    'fetchAnnotations',
    'fetchContacts',
    'fetchActorRelations'
  ], strategy) {
    if (!id) {
      const orga = new Orga()
      return Promise.resolve(orga)
    }
    const resource = new OrgasResource()
    return store.dispatch('api/getItem', {resource, id, strategy}).then(orga => {
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
    Entries.fetchActorRelations(clone)
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
