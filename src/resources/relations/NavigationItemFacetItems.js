import Resource from 'uidata/resource/Resource'

export default class NavigationItemFacetItemsResource extends Resource {
  getUrl () {
    const navigationItem = this.relation.owner
    return `fe_navigation/fe_navigation_items/${navigationItem.id}/facet_items`
  }

  serializeAttachOrDetachMany (models) {
    return {
      facet_items: models.map(model => model.id)
    }
  }
}
