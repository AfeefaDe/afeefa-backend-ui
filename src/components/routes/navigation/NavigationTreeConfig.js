import TreeConfig from '@/components/tree/TreeConfig'
import Navigation from '@/models/Navigation'
import NavigationItem from '@/models/NavigationItem'

export default class Config extends TreeConfig {
  constructor (routeComponent) {
    super(routeComponent)

    this.Model = Navigation

    this.messages = {
      loadingItem: () => this.$t('status.load_navigation'),
      loadingItemError: () => this.$t('errors.loadingNavigationError')
    }

    this.containerName = 'navigation'
    this.relationName = 'navigation_items'
    this.canColorizeItems = true
    this.canSelectIcon = true
    this.chevron = true
    this.hasOrderItems = true
  }

  loadTreeItems () {
    return Navigation.Query.get().then(navigation => {
      return navigation.navigation_items
    })
  }

  createNewTreeItem (navigation, parent) {
    const navigationItem = NavigationItem.create(navigation, parent)
    navigationItem.title = 'Neuer Menüpunkt'
    return navigationItem
  }

  cloneTreeItem (navigationItem) {
    return navigationItem.clone()
  }

  sortTreeItems (treeItems) {
    treeItems.sort((i1, i2) => i1.order - i2.order)
  }
}
