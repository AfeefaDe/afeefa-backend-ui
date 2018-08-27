import Resource from 'uidata/resource/Resource'

export default class OwnerFacetItemsResource extends Resource {
  serializeAttachOrDetachMany (models) {
    return {
      facet_items: models.map(model => model.id)
    }
  }
}
