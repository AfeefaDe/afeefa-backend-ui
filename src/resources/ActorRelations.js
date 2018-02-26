import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import ActorRelationsModel from '@/models/ActorRelations'
import Resource from './base/Resource'
import Query from './base/Query'

class ActorRelationsResource extends Resource {
  init (orgaId) {
    this.orgaId = orgaId

    this.url = BASE + `orgas{/id}/actor_relations`
    this.http = Vue.resource(this.url, {id: orgaId})
  }

  getItemJson (json) {
    json.id = this.orgaId
    return json
  }

  getItemModel () {
    return ActorRelationsModel
  }
}

class ActorRelations extends Query {
  getApi () {
    return ['forOwner', 'get', 'joinActorRelation', 'leaveActorRelation']
  }

  createResource ({owner}) {
    return new ActorRelationsResource(owner.id)
  }

  get (id) {
    return super.get(id)
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
