import Vue from 'vue'
import ResourceCache from './api/ResourceCache'
import RequestCache from './api/RequestCache'
import LoadingState from './api/LoadingState'
import LoadingStrategy from './api/LoadingStrategy'

export const BASE = '/api/v1/'

const requestCache = new RequestCache()
const resourceCache = new ResourceCache()

const getErrorDescription = response => {
  let description = ''
  if (response.body && response.body.errors) {
    for (let error of response.body.errors) {
      description += (error.detail || error) + '\n'
    }
  } else if (response.body && response.body.exception) {
    description = response.body.exception
  } else {
    description = response.statusText || response + ''
  }
  return description
}

const setRequestId = (json, requestId) => {
  if (typeof json !== 'object' || json === null) {
    return
  }

  Object.defineProperty(json, '_requestId', {
    value: requestId
  })

  for (let key in json) {
    setRequestId(json[key], requestId)
  }
}

let COUNT_SAVE_OPERATIONS = 0

export default {
  namespaced: true,


  state: {
    resourceCache,
    isSaving: false,
    requestId: 0
  },


  mutations: {
    isSaving (state) {
      state.isSaving = true
    },

    savingFinished (state) {
      state.isSaving = false
    },

    setRequestId (state, json) {
      ++state.requestId
      setRequestId(json, state.requestId)
    }
  },


  actions: {
    initApp ({commit, dispatch}) {
      Vue.http.interceptors.push((request, next) => {
        if (request.method === 'POST' || request.method === 'PATCH') {
          if (request.body && typeof request.body === 'object') {
            request.body = JSON.stringify(request.body)
          }
          request.headers.set('Content-Type', 'application/vnd.api+json')
        }

        if (request.method !== 'GET') {
          if (++COUNT_SAVE_OPERATIONS === 1) {
            commit('isSaving')
          }
        }

        next(response => {
          commit('setRequestId', response.body)

          if (request.method !== 'GET') {
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                if (--COUNT_SAVE_OPERATIONS === 0) {
                  commit('savingFinished')
                  resolve(response)
                }
              }, 500)
            })
          }
        })
      })
    },


    logout () {
      resourceCache.purge()
    },


    loadingError: ({dispatch}, response) => {
      if (!response.status) { // cancelled
        return
      }
      dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Laden',
        description: getErrorDescription(response)
      }, {root: true})
    },


    getMetaInformation: ({dispatch}) => {
      const itemResource = Vue.resource(BASE + 'meta')

      const promise = itemResource.get().then(response => {
        let metaItem = response.body.meta
        dispatch('navigation/setNumItemFromMetaInformation', {metaInformation: metaItem}, {root: true})
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading item', response)
      })
      return promise
    },


    getList: ({dispatch}, {resource, params}) => {
      // key of list in resource cache
      const listType = resource.listType
      // different caches for different list params
      const listParams = JSON.stringify({...resource.listParams, ...params} || '')

      if (resourceCache.hasList(listType, listParams)) {
        // list already loaded
        return Promise.resolve(resourceCache.getList(listType, listParams))
      }

      if (!resource.url) {
        console.error('Keine resource.url konfiguriert', listType, listParams)
      }

      // list currently loading
      const requestKey = resource.url + (params ? JSON.stringify(params) : '')
      if (requestCache.hasItem(requestKey)) {
        return requestCache.getItem(requestKey)
      }

      // load list
      const promise = resource.http.query(params).then(response => {
        const items = []

        const data = response.body.data || response.body // jsonapi spec || afeefa api spec
        for (let json of data) {
          let item
          // update existing cached items but not replace them!
          const itemType = resource.getItemType(json)
          const itemId = resource.getItemId(json)
          if (resourceCache.hasItem(itemType, itemId)) {
            item = resourceCache.getItem(itemType, itemId)
          } else {
            item = resource.createItem(json)
            resourceCache.addItem(itemType, item)
          }
          resource.itemJsonLoaded(json)
          item.deserialize(resource.getItemJson(json))

          // add model to list
          items.push(item)
        }

        // apply custom map to items, e.g. to create a category tree from a flat list
        resource.transformList(items)
        // cache list, adds all items to the cache if not yet added
        resourceCache.addList(listType, listParams, items)

        return items
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading list', response)
        return []
      })

      // cache http call
      requestCache.addItem(requestKey, promise)
      return promise
    },


    getItem: ({dispatch}, {resource, id, strategy}) => {
      if (!strategy) {
        strategy = LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED
      }

      const itemType = resource.getItemType()

      if (!id) {
        console.debug(`API: getItem(${itemType}) - keine ID gegeben.`)
        return Promise.resolve(null)
      }

      // check if item already loaded
      if (resourceCache.hasItem(itemType, id)) {
        const item = resourceCache.getItem(itemType, id)
        if (item._loadingState === LoadingState.FULLY_LOADED && strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED) {
          return Promise.resolve(resourceCache.getItem(itemType, id))
        }
        if (strategy === LoadingStrategy.LOAD_IF_NOT_CACHED) {
          return Promise.resolve(resourceCache.getItem(itemType, id))
        }
      }

      // item loading
      if (requestCache.hasItem(itemType + id)) {
        return requestCache.getItem(itemType + id)
      }

      const promise = resource.http.get({id}).then(response => {
        const json = response.body.data || response.body // jsonapi spec || afeefa api spec
        resource.itemJsonLoaded(json)

        let item
        // update existing cached items but not replace them in order to keep references alive
        if (resourceCache.hasItem(itemType, id)) {
          item = resourceCache.getItem(itemType, id)
          item.deserialize(resource.getItemJson(json))
        } else {
          item = resource.createItem(json)
          resourceCache.addItem(itemType, item)
          item.deserialize(resource.getItemJson(json))
        }

        return item
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading item', response)
        return null
      })

      // cache http call
      requestCache.addItem(itemType + id, promise)
      return promise
    },


    saveItem: ({dispatch}, {resource, item, options = {}}) => {
      const itemType = resource.getItemType()

      const itemJson = item.serialize()
      const body = options.wrapInDataProperty === false ? itemJson : {data: itemJson}

      const promise = resource.http.update(
        {id: item.id}, body
      ).then(response => {
        // we do not allow saving items that are not cached beforehand
        let cachedItem = resourceCache.getItem(itemType, item.id)
        // TODO hack to force actors to re-add to cache after
        // purge upon actor relation change @see Orgas.joinActorRelation
        // otherwise we get a notdefined error here
        if (!cachedItem) {
          cachedItem = item.clone()
          resourceCache.addItem(itemType, cachedItem)
        }

        const json = response.body.data || response.body
        resource.itemJsonLoaded(cachedItem)
        cachedItem.deserialize(resource.getItemJson(json))

        resource.itemSaved(item, cachedItem)
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
        return cachedItem
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Speichern',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error saving item', response)
        return null
      })

      return promise
    },


    addItem: ({dispatch}, {resource, item, options = {}}) => {
      const itemType = resource.getItemType()

      const itemJson = item.serialize()
      const body = options.wrapInDataProperty === false ? itemJson : {data: itemJson}

      return resource.http.save(
        {id: item.id}, body
      ).then(response => {
        const json = response.body.data || response.body
        resource.itemJsonLoaded(json)
        item.deserialize(resource.getItemJson(json))
        resourceCache.addItem(itemType, item)

        resource.itemAdded(item)
        dispatch('getMetaInformation')
        return item
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Speichern',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error adding item', response)
        return null
      })
    },


    deleteItem: ({dispatch}, {resource, item}) => {
      return resource.http.delete({id: item.id}).then(response => {
        resource.itemDeleted(item)
        dispatch('getMetaInformation')
        return true
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Löschen',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error deleting item', response)
        return null
      })
    },


    updateItemAttributes: ({dispatch}, {resource, item, type, attributes}) => {
      const data = {
        id: item.id,
        type,
        attributes
      }
      return resource.http.update({id: item.id}, {data}).then(response => {
        const itemType = resource.getItemType()

        const json = response.body.data || response.body
        const cachedItem = resourceCache.getItem(itemType, item.id)
        resource.itemJsonLoaded(cachedItem)
        cachedItem.deserialize(resource.getItemJson(json))
        return attributes
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Speichern',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error updating item', response)
        return null
      })
    }
  }
}
