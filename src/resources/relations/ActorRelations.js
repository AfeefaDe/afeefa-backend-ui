import Resource from 'uidata/resource/Resource'

export default class ActorRelationsResource extends Resource {
  getUrl () {
    return 'orgas{/id}/actor_relations'
  }

  getItemJson (json) {
    json.id = this.relation.owner.id
    return json
  }
}
