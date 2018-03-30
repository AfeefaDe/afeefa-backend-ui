import Resource from 'uidata/resource/Resource'

export default class OrgaPastEventsResource extends Resource {
  getAll () {
    return super.getAll({'filter[date]': 'past'})
  }
}
