import Entry from './base/Entry'

export default class Orga extends Entry {
  init () {
    super.init()

    this.type = 'orgas'
    this.sub_orgas = []
    this._relationIds.sub_orgas = []
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
  }

  serialize () {
    const data = super.serialize()

    data.relationships.parent_orga = this.parent_orga
      ? { data: {id: this.parent_orga.id, type: 'orgas'} }
      : null

    return data
  }

  clone () {
    return super.clone(new Orga())
  }
}
