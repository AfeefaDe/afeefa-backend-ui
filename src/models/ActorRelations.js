import Orga from '@/models/Orga'
import ActorRelationsRelation from '@/resources/relations/ActorRelationsRelation'
import LoadingState from 'data/api/LoadingState'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

class ActorRelations extends Model {
  static RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  static type = 'actor_relations'

  static relations () {
    const relations = {}
    ActorRelations.RELATIONS.forEach(relationName => {
      relations[relationName] = {
        type: Relation.HAS_MANY,
        Model: Orga,
        Query: ActorRelationsRelation
      }
    })
    return relations
  }

  calculateLoadingStateFromJson (json) {
    return LoadingState.FULLY_LOADED
  }

  normalizeJson (json) {
    // move all flat members to relationships attribute
    const jsonRelations = Object.keys(this.$rels)
      .reduce((obj, key) => ({...obj, [key]: json[key]}), {})
    return {
      id: json.id,
      relationships: jsonRelations
    }
  }
}

export default Model.register(ActorRelations)
