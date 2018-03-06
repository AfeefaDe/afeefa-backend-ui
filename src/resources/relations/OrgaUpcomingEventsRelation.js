import RelationQuery from 'data/resource/RelationQuery'

export default class OrgaUpcomingEventsRelation extends RelationQuery {
  getAll () {
    return super.getAll({'filter[date]': 'upcoming'})
  }
}
