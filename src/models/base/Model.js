import LoadingState from '@/store/api/LoadingState'
import DataTypes from './DataTypes'
import Relation from './Relation'
import toCamelCase from '@/filters/camel-case'
import LoadingStrategy from '@/store/api/LoadingStrategy'

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

  /**
   * Relations
   */

  get relations () {
    return this._relations
  }

  relation (name) {
    return this._relations[name]
  }

  hasRelation (name) {
    return !!this.constructor._relations[name]
  }

  fetchAllIncludedRelations (clone = false) {
    for (let relationName in this._relations) {
      const relation = this._relations[relationName]
      if (relation.hasIncludedData) {
        this.fetchRelation(relationName, clone)
      }
    }
  }

  fetchRelationsAfterGet (relationsToFullyFetch) {
    for (let relationName in this._relations) {
      const relation = this._relations[relationName]
      if (relationsToFullyFetch.includes(relationName)) {
        this.fetchRelation(relationName, false, LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED)
      } else if (relation.invalidated) {
        this.fetchRelation(relationName, false)
      }
    }
  }

  refetchRelation (relationName) {
    const relation = this.relation(relationName)
    relation.fetched = false
    this.fetchRelation(relationName, false)
  }

  fetchRelation (relationName, clone, strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    const relation = this.relation(relationName)

    if (relation.fetched) {
      return
    }

    const fetchFunction = this.checkFetchFunction(relation)
    if (!fetchFunction) {
      return
    }

    if (relation.type === Relation.HAS_ONE) {
      const currentItemState = (this[relationName] && this[relationName]._loadingState) || LoadingState.NOT_LOADED
      relation.fetchHasOne(id => {
        return this[fetchFunction](relation.Model, id, clone, strategy)
      }, currentItemState, strategy)
    } else {
      relation.fetchHasMany(() => {
        return this[fetchFunction](relation.Model, clone, strategy)
      })
    }
  }

  checkFetchFunction (relation) {
    const fetchFunction = 'fetch' + toCamelCase(relation.name)
    if (!this[fetchFunction]) {
      console.error('Method to fetch a relation is not defined:', fetchFunction, this.info)
      return false
    }
    return fetchFunction
  }

  /**
   * Serialization
   */

  deserialize (json) {
    if (!json._requestId && json._requestId !== 0) {
      console.error('No requestId given in json. Might be an error in normalizeJson()', this.info, json)
    }

    // we do not want to deserialize our model multiple times in the same request
    // unless we really have more data (e.g. first loaded as attributes, later got list data)
    const isSameRequest = json._requestId === this._requestId
    const jsonLoadingState = this.calculateLoadingStateFromJson(json)

    // do not deserialize if we do not have any further attribute or relation data
    if (!jsonLoadingState && this.id) {
      return
    }

    // check if we want to push more data to the model
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

    this.fetchAllIncludedRelations()
  }

  deserializeAttributes (attributesJson) {
    if (!attributesJson) {
      return
    }
    for (let name in attributesJson) {
      const localName = this.constructor._attributeRemoteNameMap[name] || name
      if (this.hasAttr(localName)) {
        this[localName] = this.getAttrValue(localName, attributesJson[name])
      }
    }
  }

  deserializeRelations (relationsJson) {
    if (!relationsJson) {
      return
    }
    for (let name in relationsJson) {
      const localName = this.constructor._relationRemoteNameMap[name] || name
      if (this.hasRelation(localName)) {
        const relation = this._relations[localName]
        relation.deserialize(relationsJson[name])
      }
    }
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
    clone.fetchAllIncludedRelations(true)
    return clone
  }

  get info () {
    const isClone = this._isClone ? '(CLONE)' : ''
    const loadedState = ['not', 'attributes', 'list', 'full'][this._loadingState]
    return `[${this.constructor.name}] id="${this.id}" ID="${this._ID}${isClone}" loaded="${loadedState}" request="${this._requestId}"`
  }
}
