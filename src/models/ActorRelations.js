import Model from './base/Model'
import Relation from './base/Relation'
import LoadingState from '@/store/api/LoadingState'

export default class ActorRelations extends Model {
  static relations = {
    networks: {
      type: Relation.HAS_MANY,
      cacheKey: 'actor_relations',
      itemType: 'orgas',
      cacheParams: owner => ({actorRelationsId: owner.id, relationName: 'networks'}),
      Model: 'Orga',
      loadingState: LoadingState.LOADED_FOR_LISTS
    },

    network_members: {
      type: Relation.HAS_MANY,
      cacheKey: 'actor_relations',
      itemType: 'orgas',
      cacheParams: owner => ({actorRelationsId: owner.id, relationName: 'network_members'}),
      Model: 'Orga',
      loadingState: LoadingState.LOADED_FOR_LISTS
    },

    projects: {
      type: Relation.HAS_MANY,
      cacheKey: 'actor_relations',
      itemType: 'orgas',
      cacheParams: owner => ({actorRelationsId: owner.id, relationName: 'projects'}),
      Model: 'Orga',
      loadingState: LoadingState.LOADED_FOR_LISTS
    },

    project_initiators: {
      type: Relation.HAS_MANY,
      cacheKey: 'actor_relations',
      itemType: 'orgas',
      cacheParams: owner => ({actorRelationsId: owner.id, relationName: 'project_initiators'}),
      Model: 'Orga',
      loadingState: LoadingState.LOADED_FOR_LISTS
    },

    partners: {
      type: Relation.HAS_MANY,
      cacheKey: 'actor_relations',
      itemType: 'orgas',
      cacheParams: owner => ({actorRelationsId: owner.id, relationName: 'partners'}),
      Model: 'Orga',
      loadingState: LoadingState.LOADED_FOR_LISTS
    }
  }

  init () {
    super.init()

    this.id = null
    this.type = 'actor_relations'
  }

  deserialize (json) {
    // this will be the conaining orga.id, injected in Orga.deserialize
    // to the loaded Json as well as in ActorRelations.createItem()
    this.id = json.id

    // TODO
    this.Model('Orga').ACTOR_RELATIONS.forEach(actorRelation => {
      if (json[actorRelation]) {
        this.relation(actorRelation).initWithJson(json[actorRelation])
      }
    })
  }
}
