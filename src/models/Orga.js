import Entry from './base/Entry'
import OrgaType from './OrgaType'
import Relation from './base/Relation'
import LoadingState from '@/store/api/LoadingState'
import DataTypes from './base/DataTypes'

export default class Orga extends Entry {
  static ACTOR_RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  static attributes = {
    orga_type_id: {
      type: DataTypes.Int,
      default: OrgaType.ORGANIZATION
    },
    count_events: DataTypes.Int,
    count_resource_items: DataTypes.Int,
    count_projects: DataTypes.Int,
    count_network_members: DataTypes.Int
  }

  init () {
    super.init()

    this.type = 'orgas'

    this.resource_items = []

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this[actorRelation] = []
    })
  }

  resourceItemsRelation () {
    return new Relation({
      type: Relation.HAS_MANY,
      cacheKey: 'resource_items',
      cacheParams: {owner_type: this.type, owner_id: this.id},
      Model: this.Model('ResourceItem')
    })
  }

  actorRelationsRelation () {
    return new Relation({
      type: Relation.HAS_ONE,
      cacheKey: 'actor_relations',
      Model: this.Model('ActorRelations')
    })
  }

  fetchActorRelations () {
    this.relation('actorRelations').fetch(id => {
      return this.Resource('ActorRelations').getForOrga(this).then(actorRelations => {
        this.actorRelations = actorRelations
        Orga.ACTOR_RELATIONS.forEach(actorRelation => {
          this[actorRelation] = actorRelations[actorRelation]
        })
        return actorRelations
      })
    })
  }

  fetchResources (clone) {
    this.relation('resourceItems').fetch(() => {
      return this.Resource('ResourceItems').getAllForOrga(this).then(resourceItems => {
        this.resource_items.length = 0
        resourceItems.forEach(resourceItem => {
          resourceItem = clone ? resourceItem.clone() : resourceItem
          this.resource_items.push(resourceItem)
        })
        return resourceItems
      })
    })
  }

  deserialize (json) {
    super.deserialize(json)

    const rels = json.relationships || {}

    // actor relations, create a merge json object for the different relations
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

    // parent orga
    if (rels.initiator && rels.initiator.data) {
      this.relation('parent_orga').initWithJson(rels.initiator.data, LoadingState.LOADED_AS_ATTRIBUTE)
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

  clone (orga) {
    const clone = super.clone(orga)
    clone.fetchResources()
    clone.fetchActorRelations()
    return clone
  }
}
