import Vue from 'vue'
import store from '@/store'
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

  itemSaved (orgaOld, orga) {
    super.itemSaved(orgaOld, orga)

    // refetch relations to this orga
    const allActorRelations = this.cacheGetAllItems('actor_relations')
    for (let orgaId in allActorRelations) {
      this.cachePurgeItem('actor_relations', orgaId)
      const relatedOrga = this.findCachedItem('orgas', orgaId)
      if (relatedOrga) {
        console.log('TODO invalidate loaded actor relations')
        // relatedOrga.invalidateLoadedActorRelations()
        // this.fetched('actorRelations', false)
        // Orga.ACTOR_RELATIONS.forEach(actorRelation => {
        //   this[actorRelation] = []
        // })
      }
    }
  }
}

class Orgas extends Query {
  // TODO save new orga throws actor relation errors
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
}

export default new Orgas()
