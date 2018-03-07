import Orga from '@/models/Orga'
import ActorRelationsRelationResource from '@/resources/relations/ActorRelationsRelation'
import LoadingState from 'uidata/api/LoadingState'
import Model from 'uidata/model/Model'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

class ActorRelations extends Model {
  static RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  static type = 'actor_relations'

  static relations () {
    const relations = {}
    ActorRelations.RELATIONS.forEach(relationName => {
      relations[relationName] = {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsRelationResource
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

export default Registry.add(ActorRelations)
