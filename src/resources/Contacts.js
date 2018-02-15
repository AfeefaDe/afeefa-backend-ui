import Vue from 'vue'
import { BASE } from '@/store/api'
import Contact from '@/models/Contact'
import Resource from './base/Resource'
import Query from './base/Query'

class ContactsResource extends Resource {
  init (owner) {
    this.owner = owner

    this.url = `${owner.type}/${owner.id}/contacts`
    this.http = Vue.resource(BASE + this.url + '{/id}', {}, {update: {method: 'PATCH'}})
  }

  getItemModel () {
    return Contact
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
    // TODO invalidate CONTACT LIST after add and delete

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

class ContactListResource extends ContactsResource {
  init (owner) {
    super.init(owner)

    this.listType = 'contacts'
    this.listParams = owner.relation('contacts').listParams()
  }
}

class Contacts extends Query {
  getApi () {
    return ['forOwner', 'getAll', 'save', 'delete']
  }

  createResource ({owner}) {
    return new ContactListResource(owner)
  }

  save (contact) {
    return super.save(contact, {wrapInDataProperty: false})
  }
}

export default new Contacts()
