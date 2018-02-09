import LoadingState from '@/store/api/LoadingState'
import ResourceRegistry from '@/resources/config/Registry'
import ModelRegistry from '../config/Registry'

let ID = 0

export default class Model {
  constructor () {
    this.__ID = ++ID
    this._loadingState = LoadingState.NOT_LOADED
    this.__isClone = false

    this._relations = {}

    this.init()
  }

  /**
   * Dependency injection for Resources
   * Prevents cyclic imports (Model -> Resource -> Model)
   */
  Resource (resourceName) {
    return ResourceRegistry.get(resourceName)
  }

  /**
   * Dependency injection for Models
   * Prevents cyclic imports (Model1 -> Model2 -> Model3)
   */
  Model (modelName) {
    return ModelRegistry.get(modelName)
  }

  get relations () {
    return this._relations
  }

  relation (name) {
    if (!this._relations[name]) {
      // expect the method to be defined by configuration in the particular model classes
      this._relations[name] = this[name + 'Relation']()
    }
    return this._relations[name]
  }

  init () {
    // reset all relations prior to deserialization
    for (let name in this._relations) {
      const relation = this._relations[name]
      relation.reset()
    }
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type
    }
    return data
  }

  /**
   * magic clone function :-)
   * clone anything but no model relations
   */
  _clone (value) {
    if (value instanceof Model) {
      const model = value
      const Constructor = model.constructor
      const clone = new Constructor()
      clone.__isClone = true
      for (let key in model) {
        // hide instance related properties
        if (key.startsWith('__')) {
          continue
        }
        const keyVal = model[key]
        // set model associations to null
        if (keyVal instanceof Model) {
          clone[key] = null
          continue
        }
        clone[key] = this._clone(keyVal)
      }
      return clone
    }

    if (Array.isArray(value)) {
      const array = value
      const clone = []
      for (let arrVal of array) {
        if (arrVal instanceof Model) {
          // do not clone associations
          continue
        }
        clone.push(this._clone(arrVal))
      }
      return clone
    }

    if (value instanceof Date) {
      return new Date(value.getTime())
    }

    if (value && typeof value.clone === 'function') {
      return value.clone()
    }

    if (value !== null && typeof value === 'object') {
      const obj = value
      const clone = {}
      for (let key in obj) {
        const keyVal = obj[key]
        // set model associations to null
        if (keyVal instanceof Model) {
          clone[key] = null
          continue
        }
        clone[key] = this._clone(keyVal)
      }
      return clone
    }

    return value
  }

  clone () {
    return this._clone(this)
  }
}
