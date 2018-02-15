import Model from './base/Model'
import Relation from './base/Relation'
import toCamelCase from '@/filters/camel-case'

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
        Model: Orga
      }

      // make an empty fectch function
      this.prototype['fetch' + toCamelCase(relationName)] = () => {}
    })

    return relations
  }

  getRelationsFromJson (json) {
    return json
  }
}
