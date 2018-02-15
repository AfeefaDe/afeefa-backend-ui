import store from '@/store'
import toCamelCase from '@/filters/camel-case'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default class Query {
  constructor () {
    this.relationsToFetch = null
    this.owner = null

    this.resource = null
    this.Model = null

    this.init()
  }

  init () {
  }

  getApi () {
    return ['with', 'get', 'getAll', 'save', 'delete', 'updateAttributes']
  }

  getResource (params) {
    if (!this.resource) {
      this.resource = this.createResource({
        owner: this.owner,
        params
      })
    }
    return this.resource
  }

  createResource () {
    console.error('Keine Resource definiert.')
  }

  with (...relations) {
    const clone = this.clone()
    clone.relationsToFetch = relations
    return clone
  }

  forOwner (owner) {
    const clone = this.clone()
    clone.owner = owner
    return clone
  }

  clone () {
    const Constructor = this.constructor
    const clone = new Constructor()
    clone.relationsToFetch = this.relationsToFetch
    clone.scope = this.scope
    return clone
  }

  get (id, strategy) {
    if (!id) {
      const model = new this.Model()
      return Promise.resolve(model)
    }
    const resource = this.getResource()
    return store.dispatch('api/getItem', {resource, id, strategy}).then(model => {
      if (model) {
        if (this.relationsToFetch) {
          this.relationsToFetch.forEach(relationName => {
            const fetchFunction = 'fetch' + toCamelCase(relationName)
            if (!model[fetchFunction]) {
              console.error('Method to fetch a relation is not defined:', fetchFunction, this.info)
            }
            model[fetchFunction](false, LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED)
          })
        }
      }
      return model
    })
  }

  getAll (params) {
    const resource = this.getResource(params)
    return store.dispatch('api/getList', {resource, params})
  }

  save (model, options) {
    const action = model.id ? 'saveItem' : 'addItem'
    return store.dispatch(`api/${action}`, {
      resource: this.getResource(),
      item: model,
      options
    })
  }

  updateAttributes (model, attributes) {
    return store.dispatch('api/updateItemAttributes', {
      resource: this.getResource(),
      item: model,
      attributes
    })
  }

  delete (model) {
    return store.dispatch('api/deleteItem', {
      resource: this.getResource(),
      item: model
    })
  }
}
