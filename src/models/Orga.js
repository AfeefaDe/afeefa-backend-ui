import Entry from './base/Entry'
import OrgaType from './OrgaType'
import Relation from './base/Relation'
import DataTypes from './base/DataTypes'

export default class Orga extends Entry {
  static type = 'orgas'

  static ACTOR_RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  static query (Orgas) {
    return Orgas
  }

  static attributes () {
    return {
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
  }

  static relations (Orga, ResourceItem, ActorRelations) {
    return {
      parent_orga: {
        type: Relation.HAS_ONE,
        Model: Orga,
        remoteName: 'initiator'
      },

      resource_items: {
        type: Relation.HAS_MANY,
        Model: ResourceItem
      },

      actor_relations: {
        type: Relation.HAS_ONE,
        Model: ActorRelations
      }
    }
  }

  fetchActorRelations () {
    this.relation('actor_relations').fetch(id => {
      return this.Resource('ActorRelations').forOwner(this).get(this.id).then(actorRelations => {
        this.actorRelations = actorRelations
        Orga.ACTOR_RELATIONS.forEach(relationName => {
          this[relationName] = actorRelations[relationName]
        })
      })
    })
  }

  fetchResourceItems (clone) {
    this.relation('resource_items').fetch(() => {
      return this.Resource('ResourceItems').forOwner(this).getAll().then(resourceItems => {
        this.resource_items = []
        resourceItems.forEach(resourceItem => {
          resourceItem = clone ? resourceItem.clone() : resourceItem
          this.resource_items.push(resourceItem)
        })
      })
    })
  }

  getRelationsFromJson (json) {
    const relations = super.getRelationsFromJson(json)

    // actor relations, create a merge json object for the different relations
    const rels = json.relationships || {}
    const actorRelationsJson = {}
    Orga.ACTOR_RELATIONS.forEach(relationName => {
      if (rels[relationName]) {
        actorRelationsJson[relationName] = rels[relationName].data
      }
    })

    if (Object.keys(actorRelationsJson).length) {
      // inject id of orga as actorRelations id
      // also see ActorRelationsResource#itemJsonLoaded
      actorRelationsJson.id = this.id
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
    clone.fetchResourceItems()
    clone.fetchActorRelations()
    return clone
  }
}
