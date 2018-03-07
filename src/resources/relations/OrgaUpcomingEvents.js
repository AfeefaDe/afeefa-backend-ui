import RelationResource from 'uidata/resource/RelationResource'

export default class OrgaUpcomingEventsRelation extends RelationResource {
  getAll () {
    return super.getAll({'filter[date]': 'upcoming'})
  }
}
