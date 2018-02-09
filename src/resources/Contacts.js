import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import Resource from './base/Resource'
import Locations from './Locations'
import Orgas from './Orgas'

class ContactsResource extends Resource {
  init ([owner]) {
    this.owner = owner

    this.http = Vue.resource(BASE + `${owner.type}/${owner.id}/contacts{/id}`, {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'contacts'
    this.listCacheParams = JSON.stringify({owner_type: owner.type, owner_id: owner.id})
  }

  createItem () {
    return new Contact()
  }

  beforeItemSaved (oldContact, contact) {
    // location might be changed and should be rewritten to resource cache
    contact.relation('location').forceCacheUpdate()
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
            owner.relation('contacts').reset()
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
    const orga = this.findCachedItem('orgas', this.orgaId)
    if (orga) {
      this.cachePurgeList('contacts', this.listCacheParams)
      orga.relation('contacts').reset()
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
  fetchLocation (contact, clone) {
    contact.relation('location').fetch(id => {
      return Locations.get(id).then(location => {
        contact.location = clone ? location.clone() : location
        return location
      })
    })
  },

  getAllForOwner (owner) {
    const resource = new ContactsResource(owner)
    return store.dispatch('api/getList', {resource}).then(contacts => {
      contacts.forEach(contact => {
        this.fetchLocation(contact)
      })
      return contacts
    })
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

  delete (orgaId, contact) {
    return store.dispatch('api/deleteItem', {
      resource: new ContactsResource(orgaId),
      item: contact
    }).then(() => {
      Orgas.get(orgaId, []).then(orga => {
        // TODO let Orga fetch the contats by itself
        orga.fetchContacts()
      })
    })
  },

  clone (contact) {
    const clone = contact.clone()
    this.fetchLocation(clone, true)
    return clone
  }
}
