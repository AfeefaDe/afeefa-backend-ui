// import global styles before entering router
// and reading component styles
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'flatpickr/dist/flatpickr.css'
import 'leaflet/dist/leaflet.css'
import '@/assets/styles/app.scss'

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

import Page from '@/components/afeefa/Page'
import Header from '@/components/afeefa/Header'
import TabBar from '@/components/TabBar'
import TextInput from '@/components/TextInput'
import InputField from '@/components/InputField'

import EntryLoadingMessage from '@/components/entry/EntryLoadingMessage'
import EntryHeader from '@/components/entry/EntryHeader'
import EntryDetail from '@/components/entry/EntryDetail'
import EntryDetailProperty from '@/components/entry/show/EntryDetailProperty'
import EntryDetailProperty2 from '@/components/entry/show/EntryDetailProperty2'
import EntryDetailSection from '@/components/entry/show/EntryDetailSection'
import EntryIcon from '@/components/entry/EntryIcon'

import TreeItemTag from '@/components/tree/TreeItemTag'
import FacetItemTag from '@/components/facet/FacetItemTag'

Vue.component('AfeefaPage', Page)
Vue.component('AfeefaHeader', Header)
Vue.component('TabBar', TabBar)
Vue.component('TextInput', TextInput)
Vue.component('InputField', InputField)

Vue.component('EntryLoadingMessage', EntryLoadingMessage)
Vue.component('EntryHeader', EntryHeader)
Vue.component('EntryDetail', EntryDetail)
Vue.component('EntryDetailProperty', EntryDetailProperty)
Vue.component('EntryDetailProperty2', EntryDetailProperty2)
Vue.component('EntryDetailSection', EntryDetailSection)
Vue.component('EntryIcon', EntryIcon)

Vue.component('TreeItemTag', TreeItemTag)
Vue.component('FacetItemTag', FacetItemTag)

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
