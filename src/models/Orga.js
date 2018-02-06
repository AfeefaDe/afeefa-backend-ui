import Entry from './base/Entry'
import OrgaType from './OrgaType'

export default class Orga extends Entry {
  static ACTOR_RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  init () {
    super.init()

    this.type = 'orgas'
    this.orga_type_id = OrgaType.ORGANIZATION
    this.count_events = 0
    this.count_resource_items = 0
    this.count_projects = 0
    this.count_network_members = 0

    this.resource_items = []

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this[actorRelation] = []
    })

    // extend _relationIds
    this._relationIds.resource_items = []
    this._eagerLoadedRelations.parent_orga = null
    this._eagerLoadedRelations.actorRelations = {}
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this._eagerLoadedRelations.actorRelations[actorRelation] = []
    })
  }

  deserialize (json) {
    super.deserialize(json)

    this.orga_type_id = json.attributes.orga_type_id
    this.count_events = json.attributes.count_events
    this.count_resource_items = json.attributes.count_resource_items
    this.count_projects = json.attributes.count_projects
    this.count_network_members = json.attributes.count_network_members

    const rels = json.relationships || {}

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (rels[actorRelation] && rels[actorRelation].data.length) {
        for (let jsonActorRelation of rels[actorRelation].data) {
          this._eagerLoadedRelations.actorRelations[actorRelation].push(jsonActorRelation)
        }
      }
    })

    // parent orga, eagerly loaded
    if (rels.initiator && rels.initiator.data) {
      this._eagerLoadedRelations.parent_orga = rels.initiator.data
      this._relationIds.parent_orga = rels.initiator.data.id // store id to be able to fetch afterwards
    }

    // resourceItems
    if (rels.resource_items && rels.resource_items.data.length) {
      for (let jsonResource of rels.resource_items.data) {
        this._relationIds.resource_items.push(jsonResource.id)
      }
    }
  }

  serialize () {
    const data = super.serialize()

    data.attributes.orga_type_id = this.orga_type_id
    data.attributes.facebook_id = this.facebook_id

    const resourceItemsSerialized = []
    for (let resourceItem of this.resource_items) {
      resourceItemsSerialized.push(resourceItem.serialize())
    }
    data.relationships.resource_items = { data: resourceItemsSerialized }

    return data
  }

  clone () {
    const clone = super.clone(this)

    // actor relations
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      clone[actorRelation] = this[actorRelation]
    })

    return clone
  }
}
