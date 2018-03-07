import RelationResource from 'uidata/resource/RelationResource'

export default class OrgaPastEventsResource extends RelationResource {
  getAll () {
    return super.getAll({'filter[date]': 'past'})
  }
}
