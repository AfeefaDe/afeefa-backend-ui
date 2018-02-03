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
    let promise
    let resource = new ContactsResource(orgaId)

    if (contact.id) {
      promise = store.dispatch('api/saveItem', {
        resource,
        item: contact,
        options: {
          wrapInDataProperty: false
        }
      })
    } else {
      promise = store.dispatch('api/addItem', {
        resource,
        item: contact,
        options: {
          wrapInDataProperty: false
        }
      })
    }

    return promise.then(contact => {
      if (contact) {
        // update contact owners contact list
        const orga = resource.findCachedItem('orgas', orgaId)
        if (orga) {
          orga.updateOrAddContact(contact)
        }
      }
      return contact
    })
  },

  delete (orgaId, contact) {
    let resource = new ContactsResource(orgaId)

    return store.dispatch('api/deleteItem', {
      resource,
      item: contact
    }).then(result => {
      // update contact owners contact list
      const orga = resource.findCachedItem('orgas', orgaId)
      if (orga) {
        orga.removeContact(contact)
      }
      return result
    })
  }
}
