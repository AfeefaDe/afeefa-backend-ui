import API from 'data/api/Api'
import resourceCache from 'data/cache/ResourceCache'
import Vue from 'vue'
export const BASE = '/api/v1/'

let COUNT_SAVE_OPERATIONS = 0

export default {
  namespaced: true,


  state: {
    cache: resourceCache.cache, // TODO duplication
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


    loadingError: ({dispatch}, apiError) => {
      if (!apiError.response.status) { // cancelled request, do not raise alert
        return
      }
      dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Laden',
        description: apiError.message
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
      return API.getList({resource, params}).catch(error => {
        dispatch('loadingError', error)
        return []
      })
    },


    getItem: ({dispatch}, {resource, id, strategy}) => {
      return API.getItem({resource, id, strategy}).catch(error => {
        dispatch('loadingError', error)
        return null
      })
    },


    saveItem: ({dispatch}, {resource, item, options = {}}) => {
      return API.saveItem({resource, item, options}).then(item => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
        return item
      }).catch(error => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Speichern',
          description: error
        }, {root: true})
        return null
      })
    },


    addItem: ({dispatch}, {resource, item, options = {}}) => {
      return API.addItem({resource, item, options}).then(item => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
        return item
      }).catch(error => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Hinzufügen',
          description: error
        }, {root: true})
        return null
      })
    },


    deleteItem: ({dispatch}, {resource, item}) => {
      return API.deleteItem({resource, item}).then(() => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
        return true
      }).catch(error => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Löschen',
          description: error
        }, {root: true})
        return false
      })
    },


    updateItemAttributes: ({dispatch}, {resource, item, attributes}) => {
      return API.updateItemAttributes({resource, item, attributes}).catch(error => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Fehler beim Speichern',
          description: error
        }, {root: true})
        return null
      })
    }
  }
}
