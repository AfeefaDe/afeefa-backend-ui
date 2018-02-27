import store from '@/store'
import LoadingState from 'data/api/LoadingState'
import toCamelCase from 'data/filter/camel-case'
import Model from 'data/model/Model'
import Relation from 'data/model/Relation'

export default class ActorRelations extends Model {
  static RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  static type = 'actor_relations'

  static query (ActorRelations) {
    return ActorRelations
  }

  static relations (Orga) {
    const relations = {}
    ActorRelations.RELATIONS.forEach(relationName => {
      relations[relationName] = {
        type: Relation.HAS_MANY,
        Model: Orga
      }

      // make a fetch function foreach relation
      const resourceCache = store.state.api.resourceCache
      this.prototype['fetch' + toCamelCase(relationName)] = function () {
        const actors = resourceCache.getList('orgas', JSON.stringify(this.relation(relationName).listParams()))
        return Promise.resolve(actors || [])
      }
    })

    return relations
  }

  calculateLoadingStateFromJson (json) {
    return LoadingState.FULLY_LOADED
  }

  normalizeJson (json) {
    const jsonRelations = Object.keys(this.relations)
      .reduce((obj, key) => ({...obj, [key]: json[key]}), {})
    return {
      id: json.id,
      relationships: jsonRelations
    }
  }
}
