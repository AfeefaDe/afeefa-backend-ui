import BaseModel from './base/BaseModel'

export default class Annotion extends BaseModel {
  init () {
    this.id = null
    this.type = 'annotations'
    this.title = ''
  }

  deserialize (json) {
    this.id = json.id
    this.title = json.attributes.title
  }
}
