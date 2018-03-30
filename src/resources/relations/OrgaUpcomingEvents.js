import Resource from 'uidata/resource/Resource'

export default class OrgaUpcomingEventsResource extends Resource {
  getAll () {
    return super.getAll({'filter[date]': 'upcoming'})
  }
}
