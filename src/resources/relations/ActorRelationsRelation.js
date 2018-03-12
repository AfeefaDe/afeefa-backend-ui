import RelationResource from 'uidata/resource/RelationResource'

export default class ActorRelationsRelationResource extends RelationResource {
  getUrl () {
    return `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }

  itemAttached (model) {
    super.itemAttached(model)

    this.purgeActorRelations(model)
  }

  itemDetached (model) {
    super.itemDetached(model)

    this.purgeActorRelations(model)
  }

  purgeActorRelations (model) {
    // purge the actor relation the model belongs to
    model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()

    // purge the actor relation this relation belongs to
    const actorRelations = this.relation.owner
    actorRelations.getParentRelations().forEach(relation => {
      relation.purgeFromCacheAndMarkInvalid()
    })
  }
}
