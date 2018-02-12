import BaseModel from '../base/Model'

class Registry {
  constructor () {
    this.models = {}
  }

  setupModelAttributes (Model) {
    let attributes = {}
    if (Model !== BaseModel) {
      const superAttrs = this.setupModelAttributes(Object.getPrototypeOf(Model))
      attributes = superAttrs
    }
    if (Model.hasOwnProperty('attributes')) {
      attributes = {...attributes, ...Model.attributes}
    }
    return attributes
  }

  add (name, Model) {
    this.models[name] = Model
  }

  initializeAll () {
    for (let name in this.models) {
      const Model = this.models[name]
      const attrs = this.setupModelAttributes(Model)

      const attribute3RemoteNameMap = {}

      for (let name in attrs) {
        if (!attrs[name].type) { // default data type
          attrs[name] = {
            type: attrs[name]
          }
        }
      }

      for (let name in attrs) {
        const attr = attrs[name]
        if (attr.remoteName) {
          attribute3RemoteNameMap[attr.remoteName] = name
        }
        Model.prototype[name] = attr.default || attr.type.value()
      }

      Model._attributes = attrs
      Model._attributeRemoteNameMap = attribute3RemoteNameMap
    }
  }

  get (name) {
    if (!this.models[name]) {
      console.warn('error getting unknown Model:', name)
    }
    return this.models[name]
  }
}

export default new Registry()
