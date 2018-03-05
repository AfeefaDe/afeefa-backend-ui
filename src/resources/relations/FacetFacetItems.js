import RelationQuery from 'data/resource/RelationQuery'

export default class FacetFacetItems extends RelationQuery {
  getApi () {
    return ['getAll', 'save', 'delete']
  }

  getSaveOptions () {
    return {
      wrapInDataProperty: false
    }
  }
}
