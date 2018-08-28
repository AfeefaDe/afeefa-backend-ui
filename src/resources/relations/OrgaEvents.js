import Resource from 'uidata/resource/Resource'

export default class OrgaEventsResource extends Resource {
  getDefaultListParams () {
    const filter = this.relation.name === 'past_events' ? 'past' : 'upcoming'
    return {'filter[date]': filter}
  }

  getAll () {
    return super.getAll(this.getDefaultListParams())
  }
}
