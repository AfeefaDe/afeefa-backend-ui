import Event from '@/models/Event'
import ResourceItem from '@/models/ResourceItem'
import Orgas from '@/resources/Orgas'
import DataTypes from 'data/model/DataTypes'
import Relation from 'data/model/Relation'

import ActorRelations from './ActorRelations'
import Entry from './base/Entry'
import OrgaType from './OrgaType'

export default class Orga extends Entry {
  static type = 'orgas'

  static query = Orgas

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

  static relations () {
    return {
      parent_orga: {
        type: Relation.HAS_ONE,
        Model: Orga,
        remoteName: 'initiator'
      },

      resource_items: {
        type: Relation.HAS_MANY,
        associationType: Relation.ASSOCIATION_COMPOSITION,
        Model: ResourceItem
      },

      actor_relations: {
        type: Relation.HAS_ONE,
        Model: ActorRelations
      },

      past_events: {
        type: Relation.HAS_MANY,
        Model: Event
      },

      upcoming_events: {
        type: Relation.HAS_MANY,
        Model: Event
      }
    }
  }

  fetchPastEvents (Event) {
    return Event.forRelation(this.$rels.past_events).getAll({'filter[date]': 'past'})
  }

  fetchUpcomingEvents (Event) {
    return Event.forRelation(this.$rels.past_events).getAll({'filter[date]': 'upcoming'})
  }

  fetchActorRelations (ActorRelations, id) {
    return ActorRelations.forRelation(this.$rels.actor_relations).get(id).then(actorRelations => {
      if (actorRelations) {
        ActorRelations.RELATIONS.forEach(relationName => {
          this[relationName] = actorRelations[relationName]
        })
      }
    })
  }

  fetchResourceItems (ResourceItem) {
    return this.$rels.resource_items.getAll()
  }

  normalizeJson (json) {
    const relationships = json.relationships

    // move all actor relations into container object
    if (relationships) {
      const actorRelationsJson = {}
      ActorRelations.RELATIONS.forEach(relationName => {
        if (relationships[relationName]) {
          actorRelationsJson[relationName] = relationships[relationName].data
          delete json.relationships[relationName]
        }
      })
      if (Object.keys(actorRelationsJson).length) {
        // inject id of orga as actorRelations id
        // also see ActorRelationsResource#itemJsonLoaded
        actorRelationsJson.id = this.id
        actorRelationsJson._requestId = json._requestId // inject requestId
        relationships.actor_relations = actorRelationsJson
      }
    }

    return {
      id: json.id,
      attributes: json.attributes,
      relationships
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
