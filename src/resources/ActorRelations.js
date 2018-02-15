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
  }

  itemJsonLoaded (json) {
    json.id = this.orgaId
  }

  getItemModel () {
    return ActorRelationsModel
  }
}

class ActorRelationActorsResource extends Resource {
  init ([actorRelations, relationName]) {
    this.url = BASE + `orgas/${actorRelations.id}/actor_relations/${relationName}`
    this.http = Vue.resource(this.url)
    this.listType = 'orgas'
    this.listParams = actorRelations.relation(relationName).listParams()
  }

  getItemModel () {
    return Orga
  }
}

const ActorRelations = {
  getForOrga (orga) {
    const resource = new ActorRelationsResource(orga.id)

    return store.dispatch('api/getItem', {resource, id: orga.id, strategy: LoadingStrategy.LOAD_IF_NOT_CACHED}).then(actorRelations => {
      const promises = []
      Orga.ACTOR_RELATIONS.forEach(relationName => {
        const actorsResource = new ActorRelationActorsResource(actorRelations, relationName)
        const promise = store.dispatch('api/getList', {resource: actorsResource}).then(actors => {
          actorRelations[relationName] = actors
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
