import Resource from 'uidata/resource/Resource'

export default class EventHostsResource extends Resource {
  getUrl () {
    const offer = this.relation.owner
    return `${offer.type}/${offer.id}/hosts`
  }

  serializeAttachOrDetachMany (models) {
    return {
      actors: models.map(model => model.id)
    }
  }
}
