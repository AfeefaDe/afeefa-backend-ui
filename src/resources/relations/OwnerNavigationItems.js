import Resource from 'uidata/resource/Resource'

export default class OwnerNavigationItemsResource extends Resource {
  serializeAttachOrDetachMany (models) {
    return {
      navigation_items: models.map(model => model.id)
    }
  }

  itemsAttached (owner) {
    super.itemsAttached(owner)

    this.cachePurgeItem('fe_navigations', 'app')
  }
}
