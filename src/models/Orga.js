import Entry from './base/Entry'

export default class Orga extends Entry {
  init () {
    super.init()

    this.type = 'orgas'
    this.sub_orgas = []
    this.resource_items = []
    // extend _relationIds
    this._relationIds.sub_orgas = []
    this._relationIds.resource_items = []
  }

  deserialize (json) {
    super.deserialize(json)

    const rels = json.relationships

    // sub orgas
    if (rels.sub_orgas && rels.sub_orgas.data.length) {
      for (let jsonOrga of rels.sub_orgas.data) {
        if (!this._relationIds.sub_orgas.includes(jsonOrga.id)) {
          this._relationIds.sub_orgas.push(jsonOrga.id)
        }
      }
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

    data.attributes.facebook_id = this.facebook_id

    data.relationships.parent_orga = this.parent_orga
      ? { data: {id: this.parent_orga.id, type: 'orgas'} }
      : null

    const resourceItemsSerialized = []
    for (let resourceItem of this.resource_items) {
      resourceItemsSerialized.push(resourceItem.serialize())
    }

    data.relationships.resource_items = {data: resourceItemsSerialized}

    return data
  }

  clone () {
    let clonedOrga = super.clone(new Orga())
    clonedOrga._relationIds.sub_orgas = this._relationIds.sub_orgas
    clonedOrga._relationIds.resource_items = this._relationIds.resource_items
    return clonedOrga
  }
}
