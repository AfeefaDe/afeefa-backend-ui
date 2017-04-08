export default class BaseModel {
  constructor () {
    this.init()
  }

  init () {
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type
    }
    return data
  }

  clone () {
    const Constructor = this.constructor
    const model = new Constructor()
    for (let key in this) {
      model[key] = this[key]
    }
    return model
  }
}
