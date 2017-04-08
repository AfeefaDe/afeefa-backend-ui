import Vue from 'vue'
import VueResource from 'vue-resource'
import store from './store'
import router from './services/router'
import i18n from './services/lang'
import App from './components/routes/App'
import Filters from './filters'
import VeeValidate from 'vee-validate'

import 'vue-flatpickr/theme/flatpickr.min.css'

Vue.use(VeeValidate, {delay: 0})
Vue.use(Filters)
Vue.use(VueResource)

Vue.config.productionTip = false

store.dispatch('initApp')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
