import RelationQuery from 'data/resource/RelationQuery'

export default class EntryFacetItems extends RelationQuery {
  getApi () {
    return ['getAll', 'attach', 'detach']
  }
}
