import Contact from '@/models/Contact'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class ContactsResource extends Resource {
  init (relation) {
    this.owner = relation.owner

    this.url = `${this.owner.type}/${this.owner.id}/contacts{/id}`
  }

  getItemModel () {
    return Contact
  }

  itemSaved (oldContact, contact) {
    if (this.ownLocationDeleted(oldContact, contact)) {
      const oldLocationId = oldContact.relation('location').id
      const ownersWithLocation = this.findOwnersOfContactsWithLocationId(oldLocationId)
      // refetch others contact list
      ownersWithLocation.forEach(owner => {
        this.cachePurgeRelation(owner.relation('contacts'))
      })
      // refetch own contact list
      this.cachePurgeRelation(this.owner.relation('contacts'))
      // reload all locations
      this.cachePurgeList('locations')
    }

    if (this.newLocationCreated(oldContact, contact)) {
      // reload all locations
      this.cachePurgeList('locations')
    }
  }

  itemDeleted (contact) {
    // reload contact list of owner
    this.cachePurgeRelation(this.owner.relation('contacts'))
    // reload all locations
    this.cachePurgeList('locations')
  }

  itemAdded (contact) {
    this.itemDeleted(contact)
  }

  findOwnersOfContactsWithLocationId (locationId) {
    const owners = []
    const contactLists = this.cacheGetAllLists('contacts')
    for (let key in contactLists) {
      const contacts = contactLists[key]
      contacts.forEach(contact => {
        if (contact.relation('location').id === locationId) {
          const {owner_type, owner_id} = JSON.parse(key) // eslint-disable-line camelcase
          const owner = this.findCachedItem(owner_type, owner_id)
          if (owner) {
            owners.push(owner)
          }
        }
      })
    }
    return owners
  }

  ownLocationDeleted (oldContact, contact) {
    const oldLocationId = oldContact.relation('location').id
    const newLocationId = contact.relation('location').id
    if (oldLocationId && oldLocationId !== newLocationId) {
      const oldLocation = this.findCachedItem('locations', oldLocationId)
      if (oldLocation.creatingContactId === contact.id) {
        return true
      }
    }
    return false
  }

  newLocationCreated (oldContact, contact) {
    const oldLocationId = oldContact.relation('location').id
    const newLocationId = contact.relation('location').id
    if (newLocationId && newLocationId !== oldLocationId) {
      const newLocation = this.findCachedItem('locations', newLocationId)
      if (newLocation.creatingContactId === contact.id) {
        return true
      }
    }
    return false
  }
}

class Contacts extends Query {
  getApi () {
    return ['forRelation', 'getAll', 'save', 'delete']
  }

  createResource ({relation}) {
    return new ContactsResource(relation)
  }

  save (contact) {
    return super.save(contact, {wrapInDataProperty: false})
  }
}

export default new Contacts()
