import TreeConfig from '@/components/tree/TreeConfig'
import FacetItem from '@/models/FacetItem'
import Facet from '@/models/Facet'

export default class Config extends TreeConfig {
  constructor (routeComponent, facetId) {
    super(routeComponent, facetId)

    this.Model = Facet

    this.messages = {
      loadingItem: () => this.$t('status.load_category'),
      loadingItemError: () => this.$t('errors.loadingCategoryError')
    }

    this.containerName = 'facet'
    this.relationName = 'facet_items'
    this.canColorizeItems = false
    this.canSelectIcon = false
    this.chevron = false
  }

  loadTreeItems (facet) {
    return facet.$rels.facet_items.refetch().then(() => {
      return facet.facet_items
    })
  }

  createNewTreeItem (container, parent) {
    const newFacetItem = FacetItem.create(container, parent)
    newFacetItem.title = 'Neues Attribut'
    return newFacetItem
  }
}
