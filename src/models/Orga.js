import OrgasResource from '@/resources/Orgas'
import ActorRelationsResource from '@/resources/relations/ActorRelations'
import OrgaEventsResource from '@/resources/relations/OrgaEvents'
import LoadingState from 'uidata/api/LoadingState'
import DataTypes from 'uidata/model/DataTypes'
import Registry from 'uidata/model/Registry'
import Relation from 'uidata/model/Relation'

import Entry from './base/Entry'
import Event from './Event' // import before entry important (cyclic imports)!
import Offer from './Offer'
import OrgaType from './OrgaType'
import ResourceItem from './ResourceItem'

class Orga extends Entry {
  static type = 'orgas'

  static Resource = OrgasResource

  static attributes () {
    return {
      orga_type_id: {
        type: DataTypes.Int,
        default: OrgaType.ORGANIZATION
      },

      count_offers: DataTypes.Int,

      count_upcoming_events: DataTypes.Int,

      count_past_events: DataTypes.Int,

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
      resource_items: {
        type: Relation.HAS_MANY,
        Model: ResourceItem
      },

      past_events: {
        type: Relation.HAS_MANY,
        Model: Event,
        Resource: OrgaEventsResource,
        reverseName: 'hosts'
      },

      upcoming_events: {
        type: Relation.HAS_MANY,
        Model: Event,
        Resource: OrgaEventsResource,
        reverseName: 'hosts'
      },

      offers: {
        type: Relation.HAS_MANY,
        Model: Offer,
        reverseName: 'owners'
      },

      projects: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsResource,
        reverseName: 'project_initiators'
      },

      project_initiators: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsResource,
        reverseName: 'projects'
      },

      networks: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsResource,
        reverseName: 'network_members'
      },

      network_members: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsResource,
        reverseName: 'networks'
      },

      partners: {
        type: Relation.HAS_MANY,
        Model: Orga,
        Resource: ActorRelationsResource,
        reverseName: 'partners'
      }
    }
  }

  init () {
    this.facetOwnerType = 'Orga'
  }

  // eslint-disable-next-line camelcase
  get count_events () {
    return this.count_upcoming_events + this.count_past_events
  }

  /**
   * For actors there is an intermediate loading state where just the
   * title is delivered in order to show the owner/host/initiator link
   * in entry lists.
   */
  calculateLoadingState () {
    if (this.$rels.contacts.fetched) {
      return LoadingState.FULLY_LOADED
    } else if (this.$rels.creator.fetched) {
      return LoadingState.LIST_DATA_LOADED
    } else {
      return LoadingState.ATTRIBUTES_LOADED
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
    data.relationships = {
      resource_items: { data: resourceItemsSerialized }
    }
    return data
  }
}

export default Registry.add(Orga)
