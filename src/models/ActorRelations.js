import Orga from '@/models/Orga'
import ActorRelationsRelationResource from '@/resources/relations/ActorRelationsRelation'
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
}

export default Registry.add(ActorRelations)
