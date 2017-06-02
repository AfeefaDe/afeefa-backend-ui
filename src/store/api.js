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


export default {
  namespaced: true,


  state: {
    resourceCache
  },


  actions: {
    initApp () {
      Vue.http.interceptors.push((request, next) => {
        if (request.method === 'POST' || request.method === 'PATCH') {
          if (request.body && typeof request.body === 'object') {
            request.body = JSON.stringify(request.body)
          }
          request.headers.set('Content-Type', 'application/vnd.api+json')
        }
        next()
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
      const listCacheKey = resource.listCacheKey

      const cacheUrl = JSON.stringify(params || '')   // distinct different caches of filtered events
      if (resourceCache.hasList(listCacheKey, cacheUrl)) {
        return Promise.resolve(resourceCache.getList(listCacheKey, cacheUrl))
      }

      if (promiseCache.hasItem(listCacheKey)) {
        return promiseCache.getItem(listCacheKey)
      }

      const promise = resource.http.query(params).then(response => {
        const items = []
        const duplicatesMap = {}
        for (let json of response.body.data) {
          const dupMapKey = json.type + json.id
          if (duplicatesMap[dupMapKey]) {
            continue
          }
          let item
          // update existing cached items but not replace them!
          const itemCacheKey = resource.getItemCacheKey(json)
          if (resourceCache.hasItem(itemCacheKey, json.id)) {
            item = resourceCache.getItem(itemCacheKey, json.id)
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
          // workaround for issue #149
          if (item) {
            items.push(item)
            duplicatesMap[dupMapKey] = true
          }
        }

        resourceCache.addList(listCacheKey, cacheUrl, items)

        return items
      }).catch(response => {
        dispatch('loadingError', response)
        console.log('error loading list', response)
        return []
      })

      promiseCache.addItem(resource.listCacheKey, promise)
      return promise
    },


    getItem: ({dispatch}, {resource, id}) => {
      const itemCacheKey = resource.getItemCacheKey()

      if (!id) {
        console.debug(`API: getItem(${itemCacheKey}) - keine ID gegeben.`)
        return Promise.resolve(null)
      }

      if (resourceCache.hasItem(itemCacheKey, id)) {
        const item = resourceCache.getItem(itemCacheKey, id)
        if (item._fullyLoaded) {
          return Promise.resolve(resourceCache.getItem(itemCacheKey, id))
        }
      }

      if (promiseCache.hasItem(itemCacheKey + id)) {
        return promiseCache.getItem(itemCacheKey + id)
      }

      const promise = resource.http.get({id}).then(response => {
        const json = response.body.data
        let item
        // update existing cached items but not replace them!
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

      promiseCache.addItem(itemCacheKey + id, promise)
      return promise
    },


    saveItem: ({dispatch}, {resource, item}) => {
      const itemCacheKey = resource.getItemCacheKey()

      return resource.http.update(
        {id: item.id}, {data: item.serialize()}
      ).then(response => {
        const cachedItem = resourceCache.getItem(itemCacheKey, item.id)
        cachedItem.deserialize(response.body.data)
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
    },


    addItem: ({dispatch}, {resource, item}) => {
      const itemCacheKey = resource.getItemCacheKey()

      return resource.http.save(
        {id: item.id}, {data: item.serialize()}
      ).then(response => {
        item.deserialize(response.body.data)
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
