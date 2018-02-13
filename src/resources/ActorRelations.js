import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ActorRelationsModel from '@/models/ActorRelations'
import Resource from './base/Resource'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import Orga from '@/models/Orga'

class ActorRelationsResource extends Resource {
  init ([orgaId]) {
    this.orgaId = orgaId

    this.url = BASE + `orgas{/id}/actor_relations`
    this.http = Vue.resource(this.url, {id: orgaId})
    this.listCacheKey = 'actor_relations'
    this.listCacheParams = JSON.stringify({orgaId: orgaId})
  }

  createItem () {
    const actorRelations = new ActorRelationsModel()
    // in order to later find the relations container, we need to give
    // it the id of our orga
    actorRelations.id = this.orgaId
    return actorRelations
  }
}

class ActorRelationActorsResource extends Resource {
  init ([orgaId, actorRelation]) {
    this.url = BASE + `orgas/${orgaId}/actor_relations/${actorRelation}`
    this.http = Vue.resource(this.url)
    this.listCacheKey = 'actor_relations'
    this.listCacheParams = JSON.stringify({actorRelationsId: orgaId, relationName: actorRelation})
  }

  createItem () {
    return new Orga()
  }
}

const ActorRelations = {
  getForOrga (orga) {
    const resource = new ActorRelationsResource(orga.id)

    return store.dispatch('api/getItem', {resource, id: orga.id, strategy: LoadingStrategy.LOAD_IF_NOT_CACHED}).then(actorRelations => {
      const promises = []
      Orga.ACTOR_RELATIONS.forEach(actorRelation => {
        const actorsResource = new ActorRelationActorsResource(orga.id, actorRelation)
        const promise = store.dispatch('api/getList', {resource: actorsResource}).then(actors => {
          actorRelations[actorRelation] = actors
        })
        promises.push(promise)
      })

      return Promise.all(promises).then(() => {
        return actorRelations
      })
    })
  }
}

export default ActorRelations
