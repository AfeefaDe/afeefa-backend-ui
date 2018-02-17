import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ActorRelationsModel from '@/models/ActorRelations'
import Resource from './base/Resource'
import Orga from '@/models/Orga'
import Query from './base/Query'

class ActorRelationsResource extends Resource {
  init (orgaId) {
    this.orgaId = orgaId

    this.url = BASE + `orgas{/id}/actor_relations`
    this.http = Vue.resource(this.url, {id: orgaId})
  }

  itemJsonLoaded (json) { // TODO might be unnecessary by now
    json.id = this.orgaId
  }

  getItemModel () {
    return ActorRelationsModel
  }
}

class ActorRelationActorsResource extends Resource {
  init (actorRelations, relationName) {
    this.url = BASE + `orgas/${actorRelations.id}/actor_relations/${relationName}`
    this.http = Vue.resource(this.url)
    this.listType = 'orgas'
    this.listParams = actorRelations.relation(relationName).listParams()
  }

  getItemModel () {
    return Orga
  }
}

class ActorRelations extends Query {
  // TODO save new orga throws actor relation errors
  getApi () {
    return ['forOwner', 'get', 'joinActorRelation', 'leaveActorRelation']
  }

  createResource ({owner}) {
    return new ActorRelationsResource(owner.id)
  }

  get (id) {
    return super.get(id).then(actorRelations => {
      if (actorRelations) {
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
      } else {
        return null
      }
    })
  }

  joinActorRelation (relationType, relatingOrga, relatedOrga) {
    const resource = Vue.resource(BASE + `orgas{/relating_id}/${relationType}{/related_id}`)
    return resource.save({
      relating_id: relatingOrga.id,
      related_id: relatedOrga.id
    }, {}).then(() => {
      relatingOrga.relation('actor_relations').purgeFromCacheAndMarkInvalid()
      relatedOrga.relation('actor_relations').purgeFromCacheAndMarkInvalid()
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
      relatingOrga.relation('actor_relations').purgeFromCacheAndMarkInvalid()
      relatedOrga.relation('actor_relations').purgeFromCacheAndMarkInvalid()
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

export default new ActorRelations()
