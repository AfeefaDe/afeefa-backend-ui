import store from '@/store'
import { BASE } from '@/store/api'
import RelationQuery from 'data/resource/RelationQuery'
import RelationResource from 'data/resource/RelationResource'
import Vue from 'vue'

class ActorRelationsResource extends RelationResource {
  init () {
    this.url = 'orgas{/id}/actor_relations'
  }

  getItemJson (json) {
    json.id = this.relation.owner.id
    return json
  }
}

export default class ActorRelations extends RelationQuery {
  getApi () {
    return ['get', 'joinActorRelation', 'leaveActorRelation']
  }

  getResource () {
    return new ActorRelationsResource(this.relation)
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
      relatingOrga.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
      relatedOrga.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
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
      relatingOrga.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
      relatedOrga.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
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
