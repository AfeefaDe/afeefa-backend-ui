import Vue from 'vue'
import { BASE } from '@/store/api'
import router from '@/services/router'

const STORAGE_KEY = 'session'

export default {
  namespaced: true,


  state: {
    currentUser: null,
    lastAuthHeader: {}
  },


  mutations: {
    setCurrentUser (state, user) {
      state.currentUser = user
    },

    setLastAuthHeader (state, header) {
      state.lastAuthHeader = header
    }
  },


  actions: {
    initApp ({state, commit, dispatch}) {
      /*
       * check auth status before each route change (esp. on app start)
       * load auth information from local storage and validate on server
       * if the user is not authenticated yet, forward it to login
       */
      router.beforeEach((to, from, next) => {
        if (!state.currentUser) { // not authenticated
          if (to.matched.some(route => route.meta.requiresAuth)) { // any protected route
            console.log('AUTH: No auth user found. Load credentials from local storage.')
            let session = localStorage.getItem(STORAGE_KEY)
            if (session) {
              console.log('AUTH: Credentials found. Validate on API.')
              let storedAuthHeader = JSON.parse(session)
              commit('setLastAuthHeader', storedAuthHeader)
              let url = BASE + 'users/validate_token'
              let request = Vue.http.get(url, {headers: storedAuthHeader})

              request.then(response => {
                console.log('AUTH: Validate credentials on API succeeded.')
                commit('setCurrentUser', response.body.data)
                next() // commit route change
              }).catch(response => {
                console.log('AUTH: Validate credentials on API failed.', response)
                if (response.status !== 401) {
                  // a possibly 401 of 'validate_token' will be auto-forwarded
                  // to login page with http interceptor below
                  dispatch('forwardToLogin')
                }
              })
            } else {
              console.log('AUTH: No info in local storage found. Forward to login.')
              router.push({name: 'login'})
            }
          } else { // login or error route
            next()
          }
        } else { // is authenticated, always passtru
          next()
        }
      })

      /*
       * pass and examine auth headers with each request
       */
      Vue.http.interceptors.push((request, next) => {
        /*
         * always add auth request headers, if any
         */
        if (state.lastAuthHeader) {
          for (let key in state.lastAuthHeader) {
            request.headers.set(key, state.lastAuthHeader[key])
          }
        }

        /*
         * check response status and store auth headers
         */
        next(response => {
          /*
           * 401
           */
          if (response.status === 401) {
            console.log('AUTH: 401 returned.')
            dispatch('forwardToLogin')
          /*
           * save auth information, if found in response
           */
          } else {
            const headers = response.headers
            if (headers.get('access-token')) {
              const authHeader = {
                'access-token': headers.get('access-token'),
                'expiry': headers.get('expiry'),
                'token-type': headers.get('token-type'),
                'uid': headers.get('uid'),
                'client': headers.get('client')
              }
              commit('setLastAuthHeader', authHeader)
              localStorage.setItem(STORAGE_KEY, JSON.stringify(authHeader))
            }
          }
        })
      })
    },


    forwardToLogin ({commit}) {
      console.log('AUTH: Clear all auth info and forward to login.')
      localStorage.removeItem(STORAGE_KEY)
      commit('setCurrentUser', null)
      commit('setLastAuthHeader', {})
      router.push({name: 'login'})
    },


    login ({commit, dispatch}, loginData) {
      const url = BASE + 'users/sign_in'
      const request = Vue.http.post(url, loginData)
      request.then(response => {
        commit('setCurrentUser', response.body.data)
        router.push({name: 'dashboard'})
      }).catch(response => {
        dispatch('messages/showAlert', {
          isError: true,
          title: 'Anmeldung fehlgeschlagen',
          description: response.body.errors ? response.body.errors[0] : response.statusText,
          autoHide: false
        }, {root: true})
        console.log('error login', response)
      })
    },


    logout ({state, commit}) {
      localStorage.removeItem(STORAGE_KEY)
      const url = BASE + 'users/sign_out'
      const request = Vue.http.delete(url, {headers: state.lastAuthHeader})
      request.then(response => {
        commit('setCurrentUser', null)
      }, response => {
        console.log('error logout', response)
      })
      return request
    }
  }
}