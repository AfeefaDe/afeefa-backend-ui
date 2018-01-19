import Entry from './base/Entry'
import OrgaType from './OrgaType'
import Entries from '@/resources/base/Entries'

export default class Orga extends Entry {
  static ACTOR_RELATIONS = ['project_initiators', 'projects', 'networks', 'network_members', 'partners']

  init () {
    super.init()

    this.type = 'orgas'
    this.orga_type_id = OrgaType.ORGANIZATION

    this.resource_items = []

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      this[actorRelation] = []
    })

    // extend _relationIds
    this._relationIds.resource_items = []
  }

  deserialize (json) {
    super.deserialize(json)

    this.orga_type_id = json.attributes.orga_type_id

    const rels = json.relationships

    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      if (rels[actorRelation] && rels[actorRelation].data.length) {
        for (let jsonActorRelation of rels[actorRelation].data) {
          const actor = new Orga()
          actor.deserialize(jsonActorRelation)
          Entries.fetchCategory(actor)
          Entries.fetchSubCategory(actor)

          this[actorRelation].push(actor)
        }
      }
    })

    // parent orga
    if (this.project_initiators.length) {
      this.parent_orga = this.project_initiators[0]
    }

    // resourceItems
    if (rels.resource_items && rels.resource_items.data.length) {
      for (let jsonResource of rels.resource_items.data) {
        if (!this._relationIds.resource_items.includes(jsonResource.id)) {
          this._relationIds.resource_items.push(jsonResource.id)
        }
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

    data.relationships.resource_items = {data: resourceItemsSerialized}

    return data
  }

  clone () {
    const clone = super.clone(this)
    Orga.ACTOR_RELATIONS.forEach(actorRelation => {
      clone[actorRelation] = this[actorRelation]
    })
    return clone
  }
}
