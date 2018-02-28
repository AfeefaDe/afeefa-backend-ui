import MetaData from '@/models/MetaData'
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
