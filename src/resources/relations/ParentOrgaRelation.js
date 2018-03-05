import RelationQuery from 'data/resource/RelationQuery'
import RelationResource from 'data/resource/RelationResource'

class ParentOrgaResource extends RelationResource {
  init () {
    this.url = 'orgas{/id}'
  }
}

export default class ParentOrgaRelation extends RelationQuery {
  getApi () {
    return ['get']
  }

  getResource () {
    return new ParentOrgaResource(this.relation)
  }
}
