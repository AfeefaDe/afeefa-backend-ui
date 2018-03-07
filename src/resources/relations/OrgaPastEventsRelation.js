import RelationResource from 'uidata/resource/RelationResource'

export default class OrgaPastEventsRelation extends RelationResource {
  getAll () {
    return super.getAll({'filter[date]': 'past'})
  }
}
