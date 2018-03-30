import Navigation from '@/models/Navigation'
import Resource from 'uidata/resource/Resource'

export default class NavigationItemsResource extends Resource {
  url = 'fe_navigation/fe_navigation_items{/id}'

  get (id) {
    return Navigation.Query.get().then(() => {
      return super.get(id)
    })
  }
}
