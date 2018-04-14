import Resource from 'uidata/resource/Resource'

export default class ActorRelationsRelationResource extends Resource {
  getUrl () {
    return `orgas/${this.relation.owner.id}/${this.relation.name}{/id}`
  }

  serializeAttachOrDetach (model) {
    return model.id
  }

  serializeAttachOrDetachMany (models) {
    return {
      actors: models.map(model => model.id)
    }
  }

  itemsAttached (models) {
    super.itemsAttached(models)

    const actorRelations = this.relation.owner

    // reload actor relations of current actor
    actorRelations.getParentRelations().forEach(relation => {
      relation.reloadOnNextGet()
    })

    // reload all not longer linked actors
    actorRelations[this.relation.name].map(relatedActor => {
      if (!models.includes(relatedActor)) {
        relatedActor.$rels.actor_relations.reloadOnNextGet()
      }
    })
  }

  itemAttached (model) {
    super.itemAttached(model)

    this.updateActorRelations(model)
  }

  itemDetached (model) {
    super.itemDetached(model)

    this.updateActorRelations(model)
  }

  updateActorRelations (model) {
    // purge the actor relation the model belongs to
    model.$rels.actor_relations.reloadOnNextGet()

    // purge the actor relation this relation belongs to
    const actorRelations = this.relation.owner
    actorRelations.getParentRelations().forEach(relation => {
      relation.reloadOnNextGet()
    })
  }
}
