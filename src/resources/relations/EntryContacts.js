import RelationResource from 'uidata/resource/RelationResource'

export default class EntryContactsResource extends RelationResource {
  itemSaved (oldContact, contact) {
    super.itemSaved(oldContact, contact)

    if (this.ownLocationDeleted(oldContact, contact)) {
      const oldLocationId = oldContact.$rels.location.id
      const ownersWithLocation = this.findOwnersOfContactsWithLocationId(oldLocationId)
      // refetch others contact list
      ownersWithLocation.forEach(owner => {
        owner.$rels.contacts.purgeFromCacheAndMarkInvalid()
      })
      // reload all locations
      this.cachePurgeList('locations')
    }

    if (this.newLocationCreated(oldContact, contact)) {
      // reload all locations
      this.cachePurgeList('locations')
    }
  }

  itemDeleted (contact) {
    super.itemDeleted(contact)

    // reload all locations
    this.cachePurgeList('locations')
  }

  itemAdded (contact) {
    super.itemAdded(contact)

    // reload all locations
    this.cachePurgeList('locations')
  }

  findOwnersOfContactsWithLocationId (locationId) {
    const owners = []
    const contactLists = this.cacheGetAllLists('contacts')
    for (let key in contactLists) {
      const contacts = contactLists[key]
      contacts.forEach(contact => {
        if (contact.$rels.location.id === locationId) {
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
    const oldLocationId = oldContact.$rels.location.id
    const newLocationId = contact.$rels.location.id
    if (oldLocationId && oldLocationId !== newLocationId) {
      const oldLocation = this.findCachedItem('locations', oldLocationId)
      if (oldLocation.creatingContactId === contact.id) {
        return true
      }
    }
    return false
  }

  newLocationCreated (oldContact, contact) {
    const oldLocationId = oldContact.$rels.location.id
    const newLocationId = contact.$rels.location.id
    if (newLocationId && newLocationId !== oldLocationId) {
      const newLocation = this.findCachedItem('locations', newLocationId)
      if (newLocation.creatingContactId === contact.id) {
        return true
      }
    }
    return false
  }
}
