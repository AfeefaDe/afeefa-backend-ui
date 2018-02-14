import Model from './base/Model'
import Relation from './base/Relation'
import LoadingState from '@/store/api/LoadingState'

export default class ActorRelations extends Model {
  static relations (Orga) {
    const relations = {}
    Orga.ACTOR_RELATIONS.forEach(relationName => {
      relations[relationName] = {
        type: Relation.HAS_MANY,
        listType: 'actor_relations',
        listParams: owner => ({actorRelationsId: owner.id, relationName: relationName}),
        Model: Orga,
        itemType: 'orgas',
        loadingState: LoadingState.LOADED_FOR_LISTS,
        data: json => json
      }
    })
    return relations
  }

  init () {
    this.type = 'actor_relations'
  }

  getRelationsFromJson (json) {
    return json
  }
}
