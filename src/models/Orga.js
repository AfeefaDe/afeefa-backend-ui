import Entry from './base/Entry'
import OrgaType from './OrgaType'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'
import LoadingState from '@/store/api/LoadingState'

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

    count_network_members: DataTypes.Int,

    networks: DataTypes.Array,

    network_members: DataTypes.Array,

    projects: DataTypes.Array,

    project_initiators: DataTypes.Array,

    partners: DataTypes.Array
  }

  static relations = {
    parent_orga: {
      type: Relation.HAS_ONE,
      cacheKey: 'orgas',
      Model: 'Orga',
      data: json => json.data,
      remoteName: 'initiator',
      loadingState: LoadingState.LOADED_AS_ATTRIBUTE
    },

    resource_items: {
      type: Relation.HAS_MANY,
      cacheKey: 'resource_items',
      cacheParams: owner => ({owner_type: owner.type, owner_id: owner.id}),
      Model: 'ResourceItem',
      data: json => json.data,
      loadingState: LoadingState.FULLY_LOADED
    },

    actor_relations: {
      type: Relation.HAS_ONE,
      cacheKey: 'actor_relations',
      Model: 'ActorRelations',
      data: json => json,
      loadingState: LoadingState.FULLY_LOADED
    }
  }

  init () {
    this.type = 'orgas'
  }

  fetchActorRelations () {
    this.relation('actor_relations').fetch(id => {
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
    this.relation('resource_items').fetch(() => {
      return this.Resource('ResourceItems').getAllForOrga(this).then(resourceItems => {
        this.resource_items = []
        resourceItems.forEach(resourceItem => {
          resourceItem = clone ? resourceItem.clone() : resourceItem
          this.resource_items.push(resourceItem)
        })
        return resourceItems
      })
    })
  }

  getRelationsFromJson (json) {
    const relations = super.getRelationsFromJson(json)

    // actor relations, create a merge json object for the different relations
    const rels = json.relationships || {}
    const actorRelationsJson = {}
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (rels[actorRelation]) {
        actorRelationsJson[actorRelation] = rels[actorRelation].data
      }
    })

    if (Object.keys(actorRelationsJson).length) {
      actorRelationsJson.id = this.id // inject id of orga as actorRelations id
      actorRelationsJson._requestId = json._requestId // inject requestId
      relations.actor_relations = actorRelationsJson
    }

    return relations
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
