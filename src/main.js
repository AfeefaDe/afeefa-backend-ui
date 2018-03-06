// import materialize js
import 'materialize-css/dist/js/materialize.min.js'
// import vue multiselect style
import 'vue-multiselect/dist/vue-multiselect.min.css'

import './services/validation'
import './services/leaflet'
import './helpers/directives'
import './models'

import VeeValidate from 'vee-validate'
import Vue from 'vue'
import VueResource from 'vue-resource'

import App from './components/routes/App'
import Filters from './filters'
import i18n from './services/lang'
import router from './services/router'
import store from './store'

Vue.use(VeeValidate, {delay: 0, locale: 'de'})
Vue.use(Filters)
Vue.use(VueResource)

Vue.config.productionTip = false

store.dispatch('initApp')
/* listen to changes on the local storage; this can be caused by other tabs updating the token */
window.addEventListener('storage', function (e) {
  store.dispatch('auth/updateAuthHeaderFromStorage', e.storageArea)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
