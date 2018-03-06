import RelationQuery from 'data/resource/RelationQuery'

export default class OrgaPastEventsRelation extends RelationQuery {
  getAll () {
    return super.getAll({'filter[date]': 'past'})
  }
}
