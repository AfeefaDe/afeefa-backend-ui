import RelationResource from 'uidata/resource/RelationResource'

export default class EntryContactsResource extends RelationResource {
  itemSaved (oldContact, contact) {
    super.itemSaved(oldContact, contact)

    // own location deleted
    if (oldContact.location && oldContact.location.creatingContactId === contact.id) {
      if (!contact.location || contact.location.creatingContactId !== contact.id) {
        this.reloadContactsOfLocation(oldContact.location)
        // reload location list
        this.cachePurgeList('locations')
      }
    }

    // new own location created
    if (contact.location && contact.location.creatingContactId === contact.id) {
      if (!oldContact.location || oldContact.location.creatingContactId !== contact.id) {
        // reload location list
        this.cachePurgeList('locations')
      }
    }
  }

  itemDeleted (contact) {
    super.itemDeleted(contact)

    // own location deleted
    if (contact.location && contact.location.creatingContactId === contact.id) {
      this.reloadContactsOfLocation(contact.location)
      // reload all locations
      this.cachePurgeList('locations')
    }
  }

  itemAdded (contact) {
    super.itemAdded(contact)

    // own location added
    if (contact.location && contact.location.creatingContactId === contact.id) {
      // reload all locations
      this.cachePurgeList('locations')
    }
  }

  reloadContactsOfLocation (location) {
    // find relations to the old location
    location.getParentRelations().forEach(relation => {
      // find contacts relation of location owner
      const contactOfOldLocation = relation.owner
      contactOfOldLocation.getParentRelations().forEach(relation => {
        relation.reloadOnNextGet()
      })
    })
  }
}
