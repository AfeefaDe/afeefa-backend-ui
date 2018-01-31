import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import BaseResource from './base/BaseResource'

class ContactsResource extends BaseResource {
  init ([orgaId]) {
    this.http = Vue.resource(BASE + `orgas/${orgaId}/contacts{/id}`, {}, {update: {method: 'PATCH'}})
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
  },

  save (orgaId, contact) {
    if (contact.id) {
      return store.dispatch('api/saveItem', {
        resource: new ContactsResource(orgaId),
        item: contact,
        options: {
          wrapInDataProperty: false
        }
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new ContactsResource(orgaId),
        item: contact,
        options: {
          wrapInDataProperty: false
        }
      })
    }
  }
}
