import TreeConfig from '@/components/tree/TreeConfig'
import Navigation from '@/models/Navigation'
import NavigationItem from '@/models/NavigationItem'

export default class Config extends TreeConfig {
  constructor (routeComponent) {
    super(routeComponent)

    this.routeName = 'navigation'
    this.Model = Navigation

    this.containerName = 'navigation'
    this.relationName = 'navigation_items'
    this.canColorizeItems = true
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

  associateItemLink (navigationItem) {
    return {
      name: 'navigation.associate',
      params: {id: navigationItem.id}
    }
  }
}
