import RelationResource from 'uidata/resource/RelationResource'

export default class ActorRelationsRelationResource extends RelationResource {
  getUrl () {
    return `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }

  itemAttached (model) {
    this.purgeActorRelations(model)
  }

  itemDetached (model) {
    this.purgeActorRelations(model)
  }

  purgeActorRelations (model) {
    // purge the relation of the attached/detached model
    model.$rels.actor_relations.purgeFromCacheAndMarkInvalid()

    // find the actors actor_relation, this (actor_relations_relation) relation belongs to
    const actorRelations = this.relation.owner
    actorRelations.getParentRelations().forEach(relation => {
      if (relation.name === 'actor_relations') {
        relation.purgeFromCacheAndMarkInvalid()
      }
    })
  }
}
