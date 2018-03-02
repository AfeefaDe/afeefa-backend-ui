import ActorRelationsModel from '@/models/ActorRelations'
import store from '@/store'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class ActorRelationsResource extends Resource {
  init (relation) {
    this.relation = relation

    this.url = 'orgas{/id}/actor_relations'
  }

  getItemJson (json) {
    json.id = this.relation.owner.id
    return json
  }

  getItemModel () {
    return ActorRelationsModel
  }
}

class ActorRelations extends Query {
  getApi () {
    return ['forRelation', 'get', 'joinActorRelation', 'leaveActorRelation']
  }

  createResource ({relation}) {
    return new ActorRelationsResource(relation)
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
      })
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
      })
      console.log('error leave actor relation', response)
      return null
    })
  }
}

export default new ActorRelations()
