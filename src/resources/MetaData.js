import ModelResource from 'uidata/resource/ModelResource'

export default class MetaDataResource extends ModelResource {
  url = 'meta'

  getItemJson (json) {
    json.id = 'app'
    return json
  }
}
