import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import Resource from './base/Resource'
import Orga from '@/models/Orga'
import Event from '@/models/Event'

class ContactsResource extends Resource {
  init ([owner]) {
    this.owner = owner

    this.http = Vue.resource(BASE + `${owner.type}/${owner.id}/contacts{/id}`, {}, {update: {method: 'PATCH'}})
    this.listType = 'contacts'
    this.listParams = JSON.stringify({owner_type: owner.type, owner_id: owner.id, relation: 'contacts'})
  }

  createItem () {
    return new Contact()
  }

  itemSaved (oldContact, contact) {
    const oldLocationId = oldContact.relation('location').id
    const newLocationId = contact.relation('location').id

    // invalidate contact lists of all orgas owning a contact
    // with the old location id
    const contactLists = this.cacheGetAllLists('contacts')
    for (let key in contactLists) {
      const contacts = contactLists[key]
      contacts.forEach(cachedContact => {
        if (cachedContact.relation('location').id === oldLocationId) {
          const {owner_type, owner_id} = JSON.parse(key) // eslint-disable-line camelcase
          const owner = this.findCachedItem(owner_type, owner_id)
          if (owner) {
            // owner.relation('contacts').reset()
          }
        }
      })
    }

    // remove old location from cache if old location has been deleted
    // clear locations list if old location has been deleted
    if (oldLocationId && oldLocationId !== newLocationId) {
      const oldLocation = this.findCachedItem('locations', oldLocationId)
      if (oldLocation.creatingContactId === contact.id) {
        this.cachePurgeItem('locations', oldLocationId)
        this.cachePurgeList('locations')
      }
    }
  }

  itemDeleted (contact) {
    // refetch contact owners contact list
    const owner = this.findCachedItem(this.owner.type, this.owner.id)
    if (owner) {
      this.cachePurgeList('contacts', this.listParams)
      owner.relation('contacts').reset()
      // TODO orga.invalidateLoadedContacts()
    }
    // reload location list
    this.cachePurgeList('locations')
  }

  itemAdded (contact) {
    this.itemDeleted(contact)
  }
}

export default {
  getAllForOwner (owner) {
    const resource = new ContactsResource(owner)
    return store.dispatch('api/getList', {resource})
  },

  save (owner, contact) {
    const action = contact.id ? 'saveItem' : 'addItem'
    return store.dispatch(`api/${action}`, {
      resource: new ContactsResource(owner),
      item: contact,
      options: {
        wrapInDataProperty: false
      }
    })
  },

  delete (owner, contact) {
    return store.dispatch('api/deleteItem', {
      resource: new ContactsResource(owner),
      item: contact
    }).then(result => {
      const Resource = owner.type === 'events' ? Event : Orga
      Resource.get(owner.id, []).then(owner => {
        // TODO let Orga fetch the contats by itself
        owner.fetchContacts()
      })
      return result
    })
  }
}
