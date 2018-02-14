import BaseModel from '../base/Model'

class ModelRegistry {
  constructor () {
    this.models = {}
  }

  add (name, Model) {
    this.models[name] = Model
  }

  initializeAll () {
    for (let name in this.models) {
      const Model = this.models[name]
      this.initializeAttributes(Model)
      this.initializeRelations(Model)
    }
  }

  getArguments (func) {
    // https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically/31194949#31194949
    return (func + '')
      .replace(/[/][/].*$/mg, '') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
      .replace(/=[^,]+/g, '') // strip any ES6 defaults
      .split(',').filter(Boolean) // split & filter [""]
  }

  get (name) {
    if (!this.models[name]) {
      console.warn('error getting unknown model:', name)
    }
    return this.models[name]
  }

  initializeAttributes (Model) {
    const attrs = this.setupAttributes(Model)
    // name: DataTypes.Int => name: { type: DataTypes.Int }
    for (let name in attrs) {
      const attr = attrs[name]
      if (!attr.type) {
        attrs[name] = {
          type: attr
        }
      }
    }

    const attributeRemoteNameMap = {}
    for (let name in attrs) {
      const attr = attrs[name]
      if (attr.remoteName) {
        attributeRemoteNameMap[attr.remoteName] = name
      }
    }
    Model._attributes = attrs
    Model._attributeRemoteNameMap = attributeRemoteNameMap
  }

  setupAttributes (Model) {
    let attributes = {}
    if (Model !== BaseModel) {
      const superAttrs = this.setupAttributes(Object.getPrototypeOf(Model))
      attributes = superAttrs
    }
    if (Model.hasOwnProperty('attributes')) {
      attributes = {...attributes, ...Model.attributes}
    }
    return attributes
  }

  initializeRelations (Model) {
    const relations = this.setupRelations(Model)
    const relationRemoteNameMap = {}
    for (let name in relations) {
      const relation = relations[name]
      if (relation.remoteName) {
        relationRemoteNameMap[relation.remoteName] = name
      }
    }
    Model._relations = relations
    Model._relationRemoteNameMap = relationRemoteNameMap
  }

  setupRelations (Model) {
    let relations = {}
    if (Model !== BaseModel) {
      const superRelations = this.setupRelations(Object.getPrototypeOf(Model))
      relations = superRelations
    }
    if (Model.hasOwnProperty('relations')) {
      const args = this.getArguments(Model.relations).map(arg => this.get(arg))
      relations = {...relations, ...Model.relations(...args)}
    }
    return relations
  }
}

export default new ModelRegistry()
