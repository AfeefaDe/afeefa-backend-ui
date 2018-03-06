import Orga from '@/models/Orga'
import ActorRelationsRelation from '@/resources/relations/ActorRelationsRelation'
import LoadingState from 'data/api/LoadingState'
import resourceCache from 'data/cache/ResourceCache'
import toCamelCase from 'data/filter/camel-case'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

export default class ActorRelations extends Model {
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

      // make a fetch function foreach relation
      this.prototype['fetch' + toCamelCase(relationName)] = function () {
        const actors = resourceCache.getList('orgas', JSON.stringify(this.$rels[relationName].listParams()))
        return Promise.resolve(actors || [])
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
