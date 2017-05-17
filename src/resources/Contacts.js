import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import BaseResource from './base/BaseResource'

class ContactsResource extends BaseResource {
  init () {
    this.http = Vue.resource(BASE + 'contact_infos{/id}')
    this.listCacheKey = 'contacts'
  }

  createItem () {
    return new Contact()
  }
}

export default {
  get (id) {
    const resource = new ContactsResource()
    return store.dispatch('api/getItem', {resource, id})
  }
}
