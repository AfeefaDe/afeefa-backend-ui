import Entry from './base/Entry'
import OrgaType from './OrgaType'
import CachedRelation from './base/CachedRelation'
import LoadingState from '@/store/api/LoadingState'
import ResourceItem from './ResourceItem'
import ActorRelations from './ActorRelations'

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
  }

  parentOrgaRelation () {
    return new CachedRelation({
      type: CachedRelation.HAS_ONE,
      cacheKey: 'orgas',
      Model: Orga
    })
  }

  resourceItemsRelation () {
    return new CachedRelation({
      type: CachedRelation.HAS_MANY,
      cacheKey: 'resource_items',
      cacheParams: {owner_type: this.type, owner_id: this.id},
      Model: ResourceItem
    })
  }

  actorRelationsRelation () {
    return new CachedRelation({
      type: CachedRelation.HAS_ONE,
      cacheKey: 'actor_relations',
      Model: ActorRelations
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

    // actor relations, create a merge object for the different relations
    const actorRelationsJson = {}
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (rels[actorRelation]) {
        actorRelationsJson[actorRelation] = rels[actorRelation].data
      }
    })
    if (Object.keys(actorRelationsJson).length) {
      // in order to later find the relations container, we need to give
      // it the id of our orga
      actorRelationsJson.id = this.id
      this.relation('actorRelations').initWithJson(actorRelationsJson)
    }

    // parent orga, eagerly loaded
    if (rels.initiator && rels.initiator.data) {
      this.relation('parentOrga').initWithJson(rels.initiator.data, LoadingState.LOADED_AS_ATTRIBUTE)
    }

    // resourceItems
    if (rels.resource_items) {
      this.relation('resourceItems').initWithJson(rels.resource_items.data)
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
}
