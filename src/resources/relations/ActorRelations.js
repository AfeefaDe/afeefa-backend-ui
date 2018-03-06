import RelationQuery from 'data/resource/RelationQuery'
import RelationResource from 'data/resource/RelationResource'

class ActorRelationsResource extends RelationResource {
  init () {
    this.url = 'orgas{/id}/actor_relations'
  }

  getItemJson (json) {
    json.id = this.relation.owner.id
    return json
  }
}

export default class ActorRelations extends RelationQuery {
  getResource () {
    return new ActorRelationsResource(this.relation)
  }

  get (id) {
    return super.get(id)
  }
}
