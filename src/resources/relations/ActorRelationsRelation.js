import RelationResource from 'uidata/resource/RelationResource'

export default class ActorRelationsRelationResource extends RelationResource {
  getUrl () {
    return `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }

  itemAttached (model) {
    model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
  }

  itemDetached (model) {
    model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()
  }
}
