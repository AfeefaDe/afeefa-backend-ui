import Resource from 'uidata/resource/Resource'
import App from 'uidata/model/App'
import Navigation from '@/models/Navigation'

export default class NavigationNavigationItemsResource extends Resource {
  getUrl () {
    return `fe_navigation/fe_navigation_items{/id}`
  }

  itemAdded (navigationItem) {
    super.itemAdded(navigationItem)

    this.reloadNavigation()
  }

  itemSaved (oldNavigationItem, navigationItem) {
    super.itemSaved(oldNavigationItem, navigationItem)

    this.reloadNavigation()
  }

  itemDeleted (navigationItem) {
    super.itemDeleted(navigationItem)

    this.reloadNavigation()
  }

  reloadNavigation () {
    const relation = App.getRelationByModel(Navigation)
    relation.reloadOnNextGet()
  }
}
