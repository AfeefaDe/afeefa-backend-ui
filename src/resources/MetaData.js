import Resource from 'uidata/resource/Resource'

export default class MetaDataResource extends Resource {
  url = 'meta'

  getItemJson (json) {
    json.id = 'app'
    return json
  }

  get () {
    return super.get('app')
  }
}
