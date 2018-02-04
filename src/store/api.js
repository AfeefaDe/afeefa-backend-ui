import Vue from 'vue'
import ResourceCache from './api/ResourceCache'
import PromiseCache from './api/PromiseCache'

export const BASE = '/api/v1/'

const promiseCache = new PromiseCache()
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

let COUNT_SAVE_OPERATIONS = 0

export default {
  namespaced: true,


  state: {
    resourceCache,
    isSaving: false
  },


  mutations: {
    isSaving (state) {
      state.isSaving = true
    },

    savingFinished (state) {
      state.isSaving = false
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
      const listCacheKey = resource.listCacheKey
      // different caches for different list params
      const cacheUrl = JSON.stringify(params || '')

      // list already loaded
      if (resourceCache.hasList(listCacheKey, cacheUrl)) {
        return Promise.resolve(resourceCache.getList(listCacheKey, cacheUrl))
      }

      // list currently loading
      if (promiseCache.hasItem(listCacheKey + cacheUrl)) {
        return promiseCache.getItem(listCacheKey + cacheUrl)
      }

      // load list
      const promise = resource.http.query(params).then(response => {
        const items = []

        const data = response.body.data || response.body // jsonapi spec || afeefa api spec
        for (let json of data) {
          let item

          // update existing cached items but not replace them!
          const itemCacheKey = resource.getItemCacheKey(json)
          const itemCacheId = resource.getItemCacheId(json)
          if (resourceCache.hasItem(itemCacheKey, itemCacheId)) {
            item = resourceCache.getItem(itemCacheKey, itemCacheId)
            /*
             * if we can find the item in cache, we assume that we
             * do not have newer or different data than stored for
             * the item found. hence, we do not need to deserialize
             * the item again. the assumption will break when we start
             * to load lists with different data for each item. in such
             * a case we would ignore the data of the latter list
             * loaded an keep the data from the first one.
             */
            // do nothing (before was: resource.deserialize(item, json))

          // no cached item found -> create one
          } else {
            item = resource.createItem(json)
            resource.deserialize(item, json)
          }
          // add model to list
          items.push(item)
        }

        // apply custom map to items, e.g. to create a category tree from a flat list
        resource.transformList(items)
        // cache list
        resourceCache.addList(listCacheKey, cacheUrl, items)

        return items
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading list', response)
        return []
      })

      // cache http call
      promiseCache.addItem(resource.listCacheKey + cacheUrl, promise)
      return promise
    },


    getItem: ({dispatch}, {resource, id}) => {
      const itemCacheKey = resource.getItemCacheKey()

      if (!id) {
        console.debug(`API: getItem(${itemCacheKey}) - keine ID gegeben.`)
        return Promise.resolve(null)
      }

      // check if item already loaded
      if (resourceCache.hasItem(itemCacheKey, id)) {
        const item = resourceCache.getItem(itemCacheKey, id)
        if (item._fullyLoaded) {
          return Promise.resolve(resourceCache.getItem(itemCacheKey, id))
        }
      }

      // item loading
      if (promiseCache.hasItem(itemCacheKey + id)) {
        return promiseCache.getItem(itemCacheKey + id)
      }

      const promise = resource.http.get({id}).then(response => {
        const json = response.body.data || response.body // jsonapi spec || afeefa api spec

        let item
        // update existing cached items but not replace them in order to keep references alive
        if (resourceCache.hasItem(itemCacheKey, id)) {
          item = resourceCache.getItem(itemCacheKey, id)
          item.deserialize(json)
        } else {
          item = resource.createItem(json)
          item.deserialize(json)
          resourceCache.addItem(itemCacheKey, item)
        }
        item._fullyLoaded = true
        return item
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading item', response)
        return null
      })

      // cache http call
      promiseCache.addItem(itemCacheKey + id, promise)
      return promise
    },


    saveItem: ({dispatch}, {resource, item, options = {}}) => {
      const itemCacheKey = resource.getItemCacheKey()

      const itemJson = item.serialize()
      const body = options.wrapInDataProperty === false ? itemJson : {data: itemJson}

      const promise = resource.http.update(
        {id: item.id}, body
      ).then(response => {
        // we do not allow saving items that are not cached beforehand
        let cachedItem = resourceCache.getItem(itemCacheKey, item.id)
        // TODO hack to force actors to re-add to cache after
        // purge upon actor relation change @see Orgas.joinActorRelation
        // otherwise we get a notdefined error here
        if (!cachedItem) {
          cachedItem = item.clone()
          resourceCache.addItem(itemCacheKey, cachedItem)
        }
        cachedItem.deserialize(response.body.data || response.body)
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
      const itemCacheKey = resource.getItemCacheKey()

      const itemJson = item.serialize()
      const body = options.wrapInDataProperty === false ? itemJson : {data: itemJson}

      return resource.http.save(
        {id: item.id}, body
      ).then(response => {
        item.deserialize(response.body.data || response.body)
        resourceCache.addItem(itemCacheKey, item)
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
        const itemCacheKey = resource.getItemCacheKey()
        const attributes = response.body.data.attributes
        const cachedItem = resourceCache.getItem(itemCacheKey, item.id)
        resource.itemAttributesUpdated(cachedItem, attributes)
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
