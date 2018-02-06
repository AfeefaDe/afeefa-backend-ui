import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import Location from '@/models/Location'
import BaseResource from './base/BaseResource'
import Locations from './Locations'
import Orgas from './Orgas'
import Entries from './base/Entries'

class ContactsResource extends BaseResource {
  init ([orgaId]) {
    this.orgaId = orgaId

    this.http = Vue.resource(BASE + `orgas/${orgaId}/contacts{/id}`, {}, {update: {method: 'PATCH'}})
    this.listCacheKey = 'contacts'
    this.listCacheParams = JSON.stringify({owner_id: orgaId, owner_type: 'orgas'})
  }

  createItem () {
    return new Contact()
  }

  itemSaved (oldContact, contact) {
    // refetch contact owners contact list
    // refetch all contact lists of owners who have a contact
    // with a location of ...
    const orga = this.findCachedItem('orgas', this.orgaId)
    if (orga) {
      // orga.contacts = []
    }

    const oldLocationId = oldContact._relationIds.location
    const newLocationId = contact._relationIds.location

    // invalidate contact lists of all orgas owning a contact
    // with the old location id
    const contactLists = this.cacheGetAllLists('contacts')
    for (let key in contactLists) {
      const contacts = contactLists[key]
      contacts.forEach(cachedContact => {
        if (cachedContact._relationIds.location === oldLocationId) {
          const {owner_type, owner_id} = JSON.parse(key) // eslint-disable-line camelcase
          const owner = this.findCachedItem(owner_type, owner_id)
          if (owner) {
            owner.invalidateLoadedContacts()
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
      orga.contacts = []
    }
    // reload location list
    this.cachePurgeList('locations')
  }

  itemAdded (contact) {
    this.itemDeleted(contact)
  }

  initEagerLoadedRelations (contact) {
    const locationJson = contact._eagerLoadedRelations.location
    if (locationJson) {
      const resourceCache = store.state.api.resourceCache
      let location = resourceCache.getItem('locations', locationJson.id)
      if (!location) {
        location = new Location()
        location.deserialize(locationJson)
        resourceCache.addItem('locations', location)
      } else {
        location.deserialize(locationJson)
      }
    }
  }
}

export default {
  initEagerLoadedRelations (contact) {
    const resource = new ContactsResource(null)
    resource.initEagerLoadedRelations(contact)
  },

  fetchLocation (contact, clone) {
    if (contact._relationLoadingStarted('location')) {
      return
    }
    const id = contact._relationIds.location
    if (id) {
      Locations.get(id).then(location => {
        contact.location = clone ? location.clone() : location
      })
    }
    contact._startLoadingRelation('location')
  },

  /**
   * Initializes all eagerly loaded contacts of the given owner.
   */
  initAllForOwner (owner, contactsJson) {
    if (contactsJson.length) {
      const resource = new ContactsResource(owner.id)
      const contacts = []
      contactsJson.forEach(contactJson => {
        const contact = new Contact()
        resource.deserialize(contact, contactJson) // also initializes contact's eagerly loaded locations
        contacts.push(contact)
      })
      const resourceCache = store.state.api.resourceCache
      resourceCache.addList('contacts', resource.listCacheParams, contacts)
    }
  },

  getAllForOwner (owner) {
    const resource = new ContactsResource(owner.id)
    return store.dispatch('api/getList', {resource}).then(contacts => {
      contacts.forEach(contact => {
        this.fetchLocation(contact)
      })
      return contacts
    })
  },

  save (orgaId, contact) {
    const action = contact.id ? 'saveItem' : 'addItem'
    return store.dispatch(`api/${action}`, {
      resource: new ContactsResource(orgaId),
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
      Orgas.get(orgaId).then(orga => {
        Entries.fetchContacts(orga)
      })
    })
  },

  clone (contact) {
    const clone = contact.clone()
    this.fetchLocation(clone, true)
    return clone
  }
}
