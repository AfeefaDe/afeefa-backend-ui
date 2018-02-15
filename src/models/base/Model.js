import LoadingState from '@/store/api/LoadingState'
import DataTypes from './DataTypes'
import Relation from './Relation'
import toCamelCase from '@/filters/camel-case'

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

    Object.defineProperty(this, '_isFetchingIncludedRelations', {
      value: false,
      writable: true
    })

    // init attributes
    for (let name in this.constructor._attributes) {
      const attr = this.constructor._attributes[name]
      this[name] = attr.hasOwnProperty('default') ? attr.default : attr.type.value()
    }
    this.type = this.constructor.type

    // init relations
    for (let relationName in this.constructor._relations) {
      const relationConfig = this.constructor._relations[relationName]
      this[relationName] = relationConfig.type === Relation.HAS_MANY ? [] : null
      const relation = new Relation({owner: this, name: relationName, ...relationConfig})
      this._relations[relationName] = relation
    }

    this.init()
  }

  init () {
  }

  /**
   * Inspects the given JSON and calculates a richness
   * value for the given data
   */
  calculateLoadingStateFromJson (json) {
    if (!json.relationships && !json.attributes) {
      return LoadingState.NOT_LOADED
    }
    return LoadingState.FULLY_LOADED
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
      relation.deserialize(relationsJson[name])
    }
  }

  fetchAllCachedRelations (clone = false) {
    if (this._isFetchingIncludedRelations) {
      return
    }

    this._isFetchingIncludedRelations = true

    // short timeout to allow the recursively running deserialization
    // process to finish before fetching the data once
    setTimeout(() => {
      for (let relationName in this._relations) {
        const relation = this._relations[relationName]
        if (relation.cached && !relation.fetched) {
          this.fetchRelationByName(relationName, clone)
        }
      }
      this._isFetchingIncludedRelations = false
    })
  }

  fetchRelationByName (relationName, clone, strategy) {
    const relation = this.relation(relationName)
    const fetchFunction = 'fetch' + toCamelCase(relation.name)
    if (!this[fetchFunction]) {
      console.error('Method to fetch a relation is not defined:', fetchFunction, this.info)
      return
    }

    relation.fetch(id => {
      if (relation.type === Relation.HAS_ONE) {
        return this[fetchFunction](relation.Model, id, clone, strategy)
      } else {
        return this[fetchFunction](relation.Model, clone, strategy)
      }
    })
  }

  /**
   * Serialization
   */

  deserialize (json) {
    if (!json._requestId && json._requestId !== 0) {
      console.error('No requestId given in json. Might be an error in normalizeJson()', this.info, json)
    }

    // we want to deserialize our model not multiple times in the same request
    const isSameRequest = json._requestId === this._requestId
    const jsonLoadingState = this.calculateLoadingStateFromJson(json)
    const wantToDeserializeMore = jsonLoadingState > this._loadingState
    if (isSameRequest && !wantToDeserializeMore) {
      return
    }

    this.id = json.id

    this._requestId = json._requestId
    this._loadingState = Math.max(this._loadingState, this.calculateLoadingStateFromJson(json))

    json = this.normalizeJson(json)

    this.deserializeAttributes(json.attributes)
    this.afterDeserializeAttributes()

    this.deserializeRelations(json.relationships)

    this.fetchAllCachedRelations()
  }

  normalizeJson (json) {
    return json
  }

  afterDeserializeAttributes (json) {
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
    clone._requestId = this._requestId
    clone._loadingState = this._loadingState
    for (let relationName in this._relations) {
      clone._relations[relationName] = this._relations[relationName].clone()
    }
    clone.fetchAllCachedRelations(true)
    return clone
  }

  get info () {
    const isClone = this._isClone ? '(CLONE)' : ''
    const loadedState = ['not', 'attributes', 'list', 'full'][this._loadingState]
    return `[${this.constructor.name}] id="${this.id}" ID="${this._ID}${isClone}" loaded="${loadedState}" request="${this._requestId}"`
  }
}
