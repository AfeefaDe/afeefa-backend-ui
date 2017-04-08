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
      description += error.detail + '\n'
    }
  } else if (response.body) {
    description = response.body.exception
  } else {
    description = response.statusText || response + ''
  }
  return description
}


export default {
  namespaced: true,


  state: {
    resourceCache: resourceCache.cache // add to state in order to show up in chromes vuex debug view
  },


  actions: {
    initApp ({dispatch}) {
      Vue.http.interceptors.push((request, next) => {
        if (request.method === 'POST' || request.method === 'PATCH') {
          request.headers.set('Content-Type', 'application/vnd.api+json')
        }
        next()
      })
    },


    getList: ({state, dispatch}, resource) => {
      const listCacheKey = resource.listCacheKey

      if (resourceCache.hasList(listCacheKey, '')) {
        return Promise.resolve(resourceCache.getList(listCacheKey, ''))
      }

      if (promiseCache.hasItem(listCacheKey)) {
        return promiseCache.getItem(listCacheKey)
      }

      const promise = resource.http.query().then(response => {
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
          // no cached item found ->
          } else {
            item = resource.createItem(json)
            item.deserialize(json)
          }
          items.push(item)
          duplicatesMap[dupMapKey] = true
        }

        resourceCache.addList(listCacheKey, '', items)

        // todo update navigation
        if (['events', 'orgas', 'todos'].includes(listCacheKey)) {
          dispatch('navigation/updateNumItems', {
            type: listCacheKey,
            numItems: items.length
          }, {
            root: true
          })
        }

        return items
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Laden',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error loading list', response)
        return []
      })

      promiseCache.addItem(resource.listCacheKey, promise)
      return promise
    },


    getItem: ({state, dispatch}, {resource, id}) => {
      const itemCacheKey = resource.getItemCacheKey()

      if (!id) {
        console.debug(`API: getItem(${itemCacheKey}) - keine ID gegeben.`)
        return Promise.resolve(null)
      }

      if (resourceCache.hasItem(itemCacheKey, id)) {
        return Promise.resolve(resourceCache.getItem(itemCacheKey, id))
      }

      if (promiseCache.hasItem(itemCacheKey + id)) {
        return promiseCache.getItem(itemCacheKey + id)
      }

      const promise = resource.http.get({id}).then(response => {
        const json = response.body.data
        const item = resource.createItem(json)
        item.deserialize(json)
        resourceCache.addItem(itemCacheKey, item)
        return item
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Laden',
          description: getErrorDescription(response)
        }, {root: true})
        console.log('error loading item', response)
        return null
      })

      promiseCache.addItem(itemCacheKey + id, promise)
      return promise
    },


    saveItem: ({state, dispatch}, {resource, item}) => {
      const itemCacheKey = resource.getItemCacheKey()

      return resource.http.update(
        {id: item.id}, {data: item.serialize()}
      ).then(response => {
        const cachedItem = resourceCache.getItem(itemCacheKey, item.id)
        // todo fixme purge cache before deserialize entry in order to be able to fully reload
        if (['events', 'orgas', 'todos'].includes(itemCacheKey)) {
          resourceCache.purgeItem('locations', item.location.id)
          resourceCache.purgeItem('contacts', item.contact.id)
        }
        cachedItem.deserialize(response.body.data)
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


    addItem: ({state, dispatch}, {resource, item}) => {
      const itemCacheKey = resource.getItemCacheKey()

      return resource.http.save(
        {id: item.id}, {data: item.serialize()}
      ).then(response => {
        // todo fixme purge cache before deserialize entry in order to be able to fully reload
        if (['events', 'orgas', 'todos'].includes(itemCacheKey)) {
          resourceCache.purgeList(itemCacheKey)
          resourceCache.purgeList('todos')
        }
        item.deserialize(response.body.data)
        resourceCache.addItem(itemCacheKey, item)
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


    deleteItem: ({state, dispatch}, {resource, item}) => {
      const itemCacheKey = resource.getItemCacheKey()

      return resource.http.delete({id: item.id}).then(response => {
        if (['events', 'orgas', 'todos'].includes(itemCacheKey)) {
          resourceCache.purgeItem(itemCacheKey, item.id)
          resourceCache.purgeList(itemCacheKey)
          resourceCache.purgeList('todos')
        }
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


    updateItemAttributes: ({state, dispatch}, {resource, id, attributes}) => {
      const data = {
        id,
        type: resource.api_type,
        attributes
      }
      return resource.http.update({id}, {data}).then(response => {
        return response.body.data.attributes
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
