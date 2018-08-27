import Resource from 'uidata/resource/Resource'

export default class ActorRelationsResource extends Resource {
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
}
