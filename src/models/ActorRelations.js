import BaseModel from './base/BaseModel'
import Orga from './Orga'
import CachedRelation from './base/CachedRelation'
import LoadingState from '@/store/api/LoadingState'

export default class ActorRelations extends BaseModel {
  init () {
    super.init()

    this.id = null
    this.type = 'actor_relations'

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this[actorRelation] = []

      this[actorRelation + 'Relation'] = () => {
        return new CachedRelation({
          type: CachedRelation.HAS_MANY,
          cacheKey: 'actor_relations',
          itemType: 'orgas',
          cacheParams: {actorRelationsId: this.id, relationName: actorRelation},
          Model: Orga
        })
      }
    })
  }

  deserialize (json) {
    // this will be the conaining orga.id, injected in Orga.deserialize
    // to the loaded Json as well as in ActorRelations.createItem()
    this.id = json.id

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (json[actorRelation]) {
        this.relation(actorRelation).initWithJson(json[actorRelation], LoadingState.LOADED_FOR_LISTS)
      }
    })
  }
}
