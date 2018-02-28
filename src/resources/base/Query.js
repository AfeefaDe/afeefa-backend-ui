import store from '@/store'
import API from 'data/api/Api'

export default class Query {
  constructor () {
    this.relationsToFetch = []
    this.owner = null

    this.resource = null

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
      return Promise.resolve(null)
    }
    const resource = this.getResource()

    return API.getItem({resource, id, strategy}).then(model => {
      if (model) {
        model.fetchRelationsAfterGet(this.relationsToFetch)
      }
      return model
    }).catch(apiError => {
      store.dispatch('api/apiError', {title: 'Fehler beim Laden', apiError})
      return null
    })
  }

  getAll (params) {
    const resource = this.getResource(params)
    return API.getList({resource, params}).then(models => {
      models.forEach(model => {
        model.fetchRelationsAfterGet()
      })
      return models
    }).catch(apiError => {
      store.dispatch('api/apiError', {title: 'Fehler beim Laden', apiError})
      return []
    })
  }

  save (model, options) {
    const resource = this.getResource()
    const action = model.id ? 'saveItem' : 'addItem'

    return API[action]({resource, item: model, options}).then(item => {
      store.dispatch('api/getMetaInformation') // e.g. todos may change after annotation change
      return item
    }).catch(apiError => {
      store.dispatch('api/apiError', {title: 'Fehler beim ' + (model.id ? 'Speichern' : 'Hinzufügen'), apiError})
      return null
    })
  }

  updateAttributes (model, attributes) {
    const resource = this.getResource()
    return API.updateItemAttributes({resource, item: model, attributes}).catch(apiError => {
      store.dispatch('api/apiError', {title: 'Fehler beim Speichern', apiError})
      return null
    })
  }

  delete (model) {
    const resource = this.getResource()
    return API.deleteItem({resource, item: model}).then(() => {
      store.dispatch('api/getMetaInformation') // e.g. todos may change after annotation change
      return true
    }).catch(apiError => {
      store.dispatch('api/apiError', {title: 'Fehler beim Löschen', apiError})
      return false
    })
  }
}
