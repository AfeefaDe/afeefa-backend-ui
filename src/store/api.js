import MetaData from '@/models/MetaData'
import API from 'data/api/Api'
import ApiError from 'data/api/ApiError'
import resourceCache from 'data/cache/ResourceCache'
import Vue from 'vue'
export const BASE = '/api/v1/'

let COUNT_SAVE_OPERATIONS = 0

export default {
  namespaced: true,

  state: {
    cache: resourceCache.cache,
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
      dispatch('setupApiHooks')

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

    setupApiHooks ({dispatch}) {
      API.onGetError = apiError => {
        dispatch('apiError', {title: 'Fehler beim Laden', apiError})
      }

      API.onAdd = model => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
      }

      API.onAddError = apiError => {
        dispatch('apiError', {title: 'Fehler beim Hinzufügen', apiError})
      }

      API.onSave = model => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
      }

      API.onSaveError = apiError => {
        dispatch('apiError', {title: 'Fehler beim Speichern', apiError})
      }

      API.onDelete = model => {
        dispatch('getMetaInformation') // e.g. todos may change after annotation change
      }

      API.onDeleteError = apiError => {
        dispatch('apiError', {title: 'Fehler beim Löschen', apiError})
      }
    },

    apiError: ({dispatch}, {title, apiError}) => {
      if (!apiError.response.status) { // cancelled request, do not raise alert
        return
      }
      dispatch('messages/showAlert', {
        isError: true,
        title,
        description: apiError.message
      }, {root: true})
    },

    getMetaInformation: ({dispatch}) => {
      resourceCache.purgeItem('meta', 'app')
      return MetaData.get('app').then(metaData => {
        dispatch('navigation/setNumItemFromMetaInformation', {metaInformation: metaData}, {root: true})
      }).catch(response => {
        const apiError = new ApiError(response)
        dispatch('apiError', {title: 'Fehler beim Laden von Metadaten', apiError})
        console.log('error loading metadata', response)
      })
    }
  }
}
