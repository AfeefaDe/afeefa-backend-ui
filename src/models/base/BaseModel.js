import LoadingState from '@/store/api/LoadingState'

let ID = 0

export default class BaseModel {
  constructor () {
    this.__ID = ++ID
    this._loadingState = LoadingState.NOT_LOADED

    this.init()
  }

  _relationLoadingStarted (relationName) {
    return this.__relationsLoadingStarted[relationName] === true
  }

  _startLoadingRelation (relationName) {
    this.__relationsLoadingStarted[relationName] = true
  }

  init () {
    this.__relationsLoadingStarted = {}
  }

  serialize () {
    const data = {
      id: this.id,
      type: this.type
    }
    return data
  }

  _clone (value) {
    if (value instanceof BaseModel) {
      const model = value
      const Constructor = model.constructor
      const clone = new Constructor()
      for (let key in model) {
        // hide instance related properties
        if (key.startsWith('__')) {
          continue
        }
        const keyVal = model[key]
        // set model associations to null
        if (keyVal instanceof BaseModel) {
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
        if (arrVal instanceof BaseModel) {
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

    if (value !== null && typeof value === 'object') {
      const obj = value
      const clone = {}
      for (let key in obj) {
        const keyVal = obj[key]
        // set model associations to null
        if (keyVal instanceof BaseModel) {
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
