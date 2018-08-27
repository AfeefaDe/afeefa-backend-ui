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

  ensureReverseRelations (host) {
    const reverseRelations = super.ensureReverseRelations(host)

    const event = this.relation.owner
    if (event.isUpcoming) {
      reverseRelations.add(host.$rels.upcoming_events)
    } else {
      reverseRelations.add(host.$rels.past_events)
    }
    return reverseRelations
  }

  itemAttached (host) {
    super.itemAttached(host)
    host.count_events++
  }

  itemDetached (host) {
    super.itemDetached(host)
    host.count_events--
  }
}
