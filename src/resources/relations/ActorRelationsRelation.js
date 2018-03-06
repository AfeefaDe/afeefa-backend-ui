import RelationQuery from 'uidata/resource/RelationQuery'
import RelationResource from 'uidata/resource/RelationResource'

class ActorRelationsRelationResource extends RelationResource {
  init () {
    this.url = `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }
}

export default class ActorRelationsRelation extends RelationQuery {
  getResource () {
    return new ActorRelationsRelationResource(this.relation)
  }

  attach (model) {
    return super.attach(model).then(result => {
      if (result) {
        model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
      }
      return result
    })
  }

  detach (model) {
    return super.detach(model).then(result => {
      if (result) {
        model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
      }
      return result
    })
  }
}
