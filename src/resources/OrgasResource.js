import Vue from 'vue'
import { BASE } from '@/store/api'
import Orga from '@/models/Orga'
import EntriesResource from './base/EntriesResource'

export default class OrgasResource extends EntriesResource {
  init () {
    this.http = Vue.resource(BASE + 'orgas{/id}', {}, {update: {method: 'PATCH'}})
    this.listType = 'orgas'
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
