import RelationQuery from 'uidata/resource/RelationQuery'

export default class OrgaPastEventsRelation extends RelationQuery {
  getAll () {
    return super.getAll({'filter[date]': 'past'})
  }
}
