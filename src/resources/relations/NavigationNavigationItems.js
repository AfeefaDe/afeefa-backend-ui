import Resource from 'uidata/resource/Resource'
import App from 'uidata/model/App'
import Navigation from '@/models/Navigation'

export default class NavigationNavigationItemsResource extends Resource {
  getUrl () {
    return `fe_navigation/fe_navigation_items{/id}`
  }

  ensureReverseRelations (host) {
    const reverseRelations = super.ensureReverseRelations(host)
    reverseRelations.reloadAlways(App.getRelationByModel(Navigation))
    return reverseRelations
  }
}
