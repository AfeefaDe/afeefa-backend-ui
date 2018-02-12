import LoadingState from '@/store/api/LoadingState'
import ResourceRegistry from '@/resources/config/Registry'
import ModelRegistry from '../config/Registry'
import DataTypes from './DataTypes'

let ID = 0

export default class Model {
  static attributes = {
    id: {
      type: DataTypes.Int
    },
    type: {
      type: DataTypes.String
    }
  }

  constructor () {
    Object.defineProperty(this, '_ID', {
      value: ++ID
    })

    Object.defineProperty(this, '_loadingState', {
      value: LoadingState.NOT_LOADED,
      writable: true
    })

    Object.defineProperty(this, '_requestId', {
      value: 0,
      writable: true
    })

    Object.defineProperty(this, '_isClone', {
      value: false,
      writable: true
    })

    Object.defineProperty(this, '_relations', {
      value: {}
    })

    Object.defineProperty(this, '_relationRemoteNameMap', {
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

  rel (name, relation) {
    this._relations[name] = relation
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

  hasAttr (name) {
    return !!this.constructor._attributes[name]
  }

  getAttrValue (name, value) {
    const attr = this.constructor._attributes[name]
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
    if (attributes._requestId <= this._requestId) {
      // console.log('wont update model since newer version stored', this.info, attributes._requestId)
      return
    } else {
      // console.log('deserialize attributes', this.info, attributes._requestId)
    }
    for (let name in attributes) {
      const localName = this.constructor._attributeRemoteNameMap[name] || name
      if (this.hasAttr(localName)) {
        this[localName] = this.getAttrValue(localName, attributes[name])
      } else {
        console.warn('Remote attribute not defined in Model:', this.constructor.name, name)
      }
    }

    this._requestId = attributes._requestId
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

  get info () {
    const isClone = this._isClone ? '(CLONE)' : ''
    return `[${this.constructor.name}] id="${this.id}" ID="${this._ID}${isClone}" request="${this._requestId}"`
  }
}
