import store from '@/store'
import LoadingState from '@/store/api/LoadingState'
import ResourceRegistry from '@/resources/config/Registry'
import DataTypes from './DataTypes'
import Relation from './Relation'

let ID = 0

export default class Model {
  static type = 'models'

  static attributes () {
    return {
      id: {
        type: DataTypes.Int,
        default: null
      },

      type: {
        type: DataTypes.String,
        default: null
      }
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

    // init attributes
    for (let name in this.constructor._attributes) {
      const attr = this.constructor._attributes[name]
      this[name] = attr.hasOwnProperty('default') ? attr.default : attr.type.value()
    }
    this.type = this.constructor.type

    // init relations
    for (let name in this.constructor._relations) {
      const relationConfig = this.constructor._relations[name]
      this[name] = relationConfig.type === Relation.HAS_MANY ? [] : null
      this._relations[name] = new Relation({owner: this, name, ...relationConfig})
    }

    this.init()
  }

  init () {
  }

  /**
   * Dependency injection for Resources
   * Prevents cyclic imports (Model -> Resource -> Model)
   */
  Resource (resourceName) {
    return ResourceRegistry.get(resourceName)
  }

  /**
   * Relations
   */

  get relations () {
    return this._relations
  }

  relation (name) {
    // return empty relation if model not loaded yet TODO
    // to prevent http calls to get the relations on null objects
    if (!this.id) {
      return {
        fetch: () => {}
      }
    }
    return this._relations[name]
  }

  /**
   * Attributes
   */

  hasAttr (name) {
    return !!this.constructor._attributes[name]
  }

  getAttrValue (name, value) {
    const attr = this.constructor._attributes[name]
    // return custom value calclulation or the default calculation of the type
    return attr.value ? attr.value(value) : attr.type.value(value)
  }

  deserializeAttributes (attributesJson) {
    if (!attributesJson) {
      return
    }
    for (let name in attributesJson) {
      const localName = this.constructor._attributeRemoteNameMap[name] || name
      if (!this.hasAttr(localName)) {
        // console.debug('Remote attribute not defined in Model:', this.constructor.name, name)
        continue
      }
      this[localName] = this.getAttrValue(localName, attributesJson[name])
    }
  }

  hasRelation (name) {
    return !!this.constructor._relations[name]
  }

  deserializeRelations (relationsJson) {
    if (!relationsJson) {
      return
    }
    for (let name in relationsJson) {
      const localName = this.constructor._relationRemoteNameMap[name] || name
      if (!this.hasRelation(localName)) {
        // console.debug('Remote relation not defined in Model:', this.constructor.name, name)
        continue
      }

      const relation = this._relations[localName]

      const resourceCache = store.state.api.resourceCache
      relation.deserialize(resourceCache, relationsJson[name])
    }
  }

  /**
   * Serialization
   */
  deserialize (json) {
    this.id = json.id

    this.deserializeAttributes(this.getAttributesFromJson(json))
    this.deserializeRelations(this.getRelationsFromJson(json))

    this._requestId = json._requestId

    this.afterDeserialize()

    // if (this.type === 'orgas' && this.id === '4274') {
    //   console.log('DEZERIALIZE', json._requestId, this.info, json)
    // }
  }

  getAttributesFromJson (json) {
  }

  getRelationsFromJson (json) {
  }

  afterDeserialize (json) {
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
    return `[${this.constructor.name}] id="${this.id}" ID="${this._ID}${isClone}" request="${this._requestId}" loaded="${this._loadingState}"`
  }
}
