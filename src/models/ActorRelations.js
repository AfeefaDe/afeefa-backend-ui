import BaseModel from './base/BaseModel'
import Orga from './Orga'

export default class ActorRelations extends BaseModel {
  init () {
    super.init()

    this.id = null

    this.type = 'actor_relations'

    this._eagerLoadedRelations = {}

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this[actorRelation] = []
      this._eagerLoadedRelations[actorRelation] = []
    })
  }

  deserialize (json) {
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (json[actorRelation]) {
        this._eagerLoadedRelations[actorRelation] = json[actorRelation]
      }
    })
  }
}
