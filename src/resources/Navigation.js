import Resource from 'uidata/resource/Resource'

export default class NavigationResource extends Resource {
  url = 'fe_navigation'

  getItemJson (json) {
    json.id = 'app'
    return json
  }

  get () {
    return super.get('app')
  }

  itemLoaded (navigation) {
    super.itemLoaded(navigation)

    // set navigation to any navigation item
    const items = navigation.getAllNavigationItems()
    items.forEach(item => {
      item.navigation = navigation
    })
  }
}
