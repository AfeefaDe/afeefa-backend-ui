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
}
