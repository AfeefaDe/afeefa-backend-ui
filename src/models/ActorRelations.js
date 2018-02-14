import Model from './base/Model'
import Relation from './base/Relation'

export default class ActorRelations extends Model {
  static type = 'actor_relations'

  static query (ActorRelations) {
    return ActorRelations
  }

  static relations (Orga) {
    const relations = {}
    Orga.ACTOR_RELATIONS.forEach(relationName => {
      relations[relationName] = {
        type: Relation.HAS_MANY,
        Model: Orga,
        contains: Relation.CONTAINS_LIST_DATA
      }
    })
    return relations
  }

  deserialize (json) {
    // TODO find a way to inject the orga id into actorRelations
    if (this.id) {
      json.id = this.id
    }

    super.deserialize(json)
  }

  getRelationsFromJson (json) {
    return json
  }
}
