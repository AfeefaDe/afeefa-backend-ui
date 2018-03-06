import RelationQuery from 'uidata/resource/RelationQuery'
import RelationResource from 'uidata/resource/RelationResource'

class ParentOrgaResource extends RelationResource {
  init () {
    this.url = 'orgas{/id}'
  }
}

export default class ParentOrgaRelation extends RelationQuery {
  getResource () {
    return new ParentOrgaResource(this.relation)
  }
}
