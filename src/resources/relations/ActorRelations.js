import RelationResource from 'uidata/resource/RelationResource'

export default class ActorRelationsResource extends RelationResource {
  getUrl () {
    return 'orgas{/id}/actor_relations'
  }

  getItemJson (json) {
    json.id = this.relation.owner.id
    return json
  }
}
