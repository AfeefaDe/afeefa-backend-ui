import Vue from 'vue'
import VueResource from 'vue-resource'
import store from './store'
import router from './services/router'
import i18n from './services/lang'
import App from './components/routes/App'
import Filters from './filters'
import VeeValidate from 'vee-validate'
import './services/validation'
import './services/leaflet'

// import materialize js and css
import 'materialize-css/dist/js/materialize.min.js'
import 'materialize-css/dist/css/materialize.min.css'
// import vue multiselect style
import 'vue-multiselect/dist/vue-multiselect.min.css'
// import css-toggle-switch
import 'css-toggle-switch/dist/toggle-switch.css'

Vue.use(VeeValidate, {delay: 0, locale: 'de'})
Vue.use(Filters)
Vue.use(VueResource)

Vue.config.productionTip = false

store.dispatch('initApp')
/* listen to changes on the local storage; this can be caused by other tabs updating the token */
window.addEventListener('storage', function () {
  store.dispatch('auth/updateAuthHeaderFromStorage')
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
