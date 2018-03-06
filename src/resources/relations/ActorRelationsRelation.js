import RelationQuery from 'data/resource/RelationQuery'
import RelationResource from 'data/resource/RelationResource'

class ActorRelationsRelationResource extends RelationResource {
  init () {
    this.url = `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }
}

export default class ActorRelationsRelation extends RelationQuery {
  getApi () {
    return ['attach', 'detach']
  }

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
