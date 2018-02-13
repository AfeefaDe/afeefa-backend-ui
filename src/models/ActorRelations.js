import Model from './base/Model'
import Relation from './base/Relation'
import LoadingState from '@/store/api/LoadingState'

export default class ActorRelations extends Model {
  static relations = {
    networks: {
      type: Relation.HAS_MANY,
      listType: 'actor_relations',
      listParams: owner => ({actorRelationsId: owner.id, relationName: 'networks'}),
      Model: 'Orga',
      itemType: 'orgas',
      loadingState: LoadingState.LOADED_FOR_LISTS,
      data: json => json
    },

    network_members: {
      type: Relation.HAS_MANY,
      listType: 'actor_relations',
      listParams: owner => ({actorRelationsId: owner.id, relationName: 'network_members'}),
      Model: 'Orga',
      itemType: 'orgas',
      loadingState: LoadingState.LOADED_FOR_LISTS,
      data: json => json
    },

    projects: {
      type: Relation.HAS_MANY,
      listType: 'actor_relations',
      listParams: owner => ({actorRelationsId: owner.id, relationName: 'projects'}),
      Model: 'Orga',
      itemType: 'orgas',
      loadingState: LoadingState.LOADED_FOR_LISTS,
      data: json => json
    },

    project_initiators: {
      type: Relation.HAS_MANY,
      listType: 'actor_relations',
      listParams: owner => ({actorRelationsId: owner.id, relationName: 'project_initiators'}),
      Model: 'Orga',
      itemType: 'orgas',
      loadingState: LoadingState.LOADED_FOR_LISTS,
      data: json => json
    },

    partners: {
      type: Relation.HAS_MANY,
      listType: 'actor_relations',
      listParams: owner => ({actorRelationsId: owner.id, relationName: 'partners'}),
      Model: 'Orga',
      itemType: 'orgas',
      loadingState: LoadingState.LOADED_FOR_LISTS,
      data: json => json
    }
  }

  init () {
    this.type = 'actor_relations'
  }

  getRelationsFromJson (json) {
    return json
  }
}
