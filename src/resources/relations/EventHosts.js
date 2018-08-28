import Resource from 'uidata/resource/Resource'

export default class EventHostsResource extends Resource {
  getUrl () {
    const event = this.relation.owner
    return `${event.type}/${event.id}/hosts`
  }

  serializeAttachOrDetachMany (models) {
    return {
      actors: models.map(model => model.id)
    }
  }
}
