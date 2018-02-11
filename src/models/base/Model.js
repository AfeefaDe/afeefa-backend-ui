import LoadingState from '@/store/api/LoadingState'
import ResourceRegistry from '@/resources/config/Registry'
import ModelRegistry from '../config/Registry'

let ID = 0

export default class Model {
  constructor () {
    Object.defineProperty(this, '_ID', {
      value: ++ID
    })

    Object.defineProperty(this, '_loadingState', {
      value: LoadingState.NOT_LOADED,
      writable: true
    })

    Object.defineProperty(this, '_isClone', {
      value: false,
      writable: true
    })

    Object.defineProperty(this, '_attributes', {
      value: {}
    })

    Object.defineProperty(this, '_attributeRemoteNameMap', {
      value: {}
    })

    Object.defineProperty(this, '_relations', {
      value: {}
    })

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
    // return empty relation if model not loaded yet
    if (!this.id) {
      return {
        fetch: () => {}
      }
    }

    if (!this._relations[name]) {
      // expect the method to be defined by configuration in the particular model classes
      this._relations[name] = this[name + 'Relation']()
    }
    return this._relations[name]
  }

  attr (name, type, options = {}) {
    this._attributes[name] = {
      type,
      ...options
    }

    if (options.remoteName) {
      this._attributeRemoteNameMap[options.remoteName] = name
    }

    // set given default value or the types default value
    this[name] = options.default || type.value()
  }

  hasAttr (name) {
    return !!this._attributes[name]
  }

  getAttrValue (name, value) {
    const attr = this._attributes[name]
    // return custom value calclulation or the default calculation of the type
    return attr.value ? attr.value(value) : attr.type.value(value)
  }

  init () {
    // reset all relations prior to deserialization
    for (let name in this._relations) {
      const relation = this._relations[name]
      relation.reset()
    }
  }

  deserializeAttributes (attributes) {
    for (let name in attributes) {
      const localName = this._attributeRemoteNameMap[name] || name
      if (this.hasAttr(localName)) {
        this[localName] = this.getAttrValue(localName, attributes[name])
      }
    }
  }

  serialize () {
    // default serialization
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
      clone._isClone = true
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
    const clone = this._clone(this)
    clone._loadingState = this._loadingState
    for (let relationName in this._relations) {
      clone._relations[relationName] = this._relations[relationName].clone()
    }
    return clone
  }
}
