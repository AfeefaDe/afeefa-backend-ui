import RelationResource from 'uidata/resource/RelationResource'

export default class OrgaUpcomingEventsResource extends RelationResource {
  getAll () {
    return super.getAll({'filter[date]': 'upcoming'})
  }
}
