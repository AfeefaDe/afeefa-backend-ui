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
    const allRelations = this.setupRelations(Model)
    const modelRelations = {}

    const relationRemoteNameMap = {}
    for (let name in allRelations) {
      const relation = allRelations[name]
      const modelRelation = {...relation}
      if (modelRelation.Model) {
        modelRelation.Model = this.get(modelRelation.Model)
      }
      modelRelations[name] = modelRelation
      if (modelRelation.remoteName) {
        relationRemoteNameMap[modelRelation.remoteName] = name
      }
    }
    Model._relations = modelRelations
    Model._relationRemoteNameMap = relationRemoteNameMap
  }

  setupRelations (Model) {
    let relations = {}
    if (Model !== BaseModel) {
      const superRelations = this.setupRelations(Object.getPrototypeOf(Model))
      relations = superRelations
    }
    if (Model.hasOwnProperty('relations')) {
      relations = {...relations, ...Model.relations}
    }
    return relations
  }
}

export default new ModelRegistry()
