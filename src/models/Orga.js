import Event from '@/models/Event'
import ResourceItem from '@/models/ResourceItem'
import Orgas from '@/resources/Orgas'
import ActorRelationsRelation from '@/resources/relations/ActorRelations'
import OrgaPastEventsRelation from '@/resources/relations/OrgaPastEventsRelation'
import OrgaUpcomingEventsRelation from '@/resources/relations/OrgaUpcomingEventsRelation'
import ParentOrgaRelation from '@/resources/relations/ParentOrgaRelation'
import DataTypes from 'uidata/model/DataTypes'
import Model from 'uidata/model/Model'
import Relation from 'uidata/model/Relation'

import ActorRelations from './ActorRelations'
import Entry from './base/Entry'
import OrgaType from './OrgaType'

class Orga extends Entry {
  static type = 'orgas'

  static Resource = new Orgas(Orga)

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
        remoteName: 'initiator',
        Query: ParentOrgaRelation
      },

      resource_items: {
        type: Relation.HAS_MANY,
        Model: ResourceItem
      },

      actor_relations: {
        type: Relation.HAS_ONE,
        Model: ActorRelations,
        Query: ActorRelationsRelation
      },

      past_events: {
        type: Relation.HAS_MANY,
        Model: Event,
        Query: OrgaPastEventsRelation
      },

      upcoming_events: {
        type: Relation.HAS_MANY,
        Model: Event,
        Query: OrgaUpcomingEventsRelation
      }
    }
  }

  onActorRelations (actorRelations) {
    if (actorRelations) {
      ActorRelations.RELATIONS.forEach(relationName => {
        this[relationName] = actorRelations[relationName]
      })
    }
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

export default Model.register(Orga)
