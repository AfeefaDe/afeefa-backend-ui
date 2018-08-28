import Resource from 'uidata/resource/Resource'
import App from 'uidata/model/App'
import Navigation from '@/models/Navigation'

export default class NavigationNavigationItemsResource extends Resource {
  getUrl () {
    return `fe_navigation/fe_navigation_items{/id}`
  }

  ensureReverseRelationsAfterAddOrSave (host) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(host)
    ensure.reloadAlways(App.getRelationByModel(Navigation))
    return ensure
  }
}
