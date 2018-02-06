import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ActorRelationsModel from '@/models/ActorRelations'
import BaseResource from './base/BaseResource'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import Orga from '@/models/Orga'
import LoadingState from '@/store/api/LoadingState'

class ActorRelationsResource extends BaseResource {
  init ([orgaId]) {
    this.orgaId = orgaId

    this.url = BASE + `orgas{/id}/actor_relations`
    this.http = Vue.resource(this.url, {id: orgaId})
    this.listCacheKey = 'actor_relations'
    this.listCacheParams = JSON.stringify({orgaId: orgaId})
  }

  createItem () {
    const actorRelations = new ActorRelationsModel()
    actorRelations.id = this.orgaId
    return actorRelations
  }

  initEagerLoadedRelations (actorRelations) {
    ActorRelations.initActorRelations(this.orgaId, actorRelations)
  }
}

const ActorRelations = {
  /**
   * Initializes all relations
   */
  initActorRelations (actorId, actorRelations) {
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      const actorsJson = actorRelations._eagerLoadedRelations[actorRelation]
      const actors = ActorRelations.initActorRelation(actorsJson, 'actor_relations', this.listCacheParams, LoadingState.LOADED_AS_ATTRIBUTE)
      actorRelations[actorRelation] = actors
    })
    const resourceCache = store.state.api.resourceCache
    resourceCache.addItem('actor_relations', actorRelations)
  },

  /**
   * Initializes a list of eagerly loaded related orgas
   */
  initActorRelation (actorsJson, listName, listUrl, loadingState) {
    const actors = []
    if (actorsJson.length) {
      actorsJson.forEach(actorJson => {
        const actor = this.initRelatedActor(actorJson, loadingState)
        actors.push(actor)
      })
    }
    return actors
  },

  /**
   * Initializes an eagerly loaded related orga
   */
  initRelatedActor (actorJson, loadingState) {
    if (actorJson) {
      const resourceCache = store.state.api.resourceCache
      let orga = resourceCache.getItem('orgas', actorJson.id)
      if (!orga) {
        orga = new Orga()
        orga.deserialize(actorJson)
        orga._loadingState = loadingState
        resourceCache.addItem('orgas', orga)
      } else {
        if (orga._loadingState < loadingState) {
          orga.deserialize(actorJson)
          orga._loadingState = loadingState
        }
      }
      return orga
    }
  },

  getRelatedActors (orga, actorRelation) {
    const resource = new ActorRelationsResource(orga.id)
    return store.dispatch('api/getItem', {resource, id: orga.id, strategy: LoadingStrategy.RETURN_CACHED_OR_LOAD}).then(actorRelations => {
      return actorRelations[actorRelation]
    })
  }
}

export default ActorRelations
