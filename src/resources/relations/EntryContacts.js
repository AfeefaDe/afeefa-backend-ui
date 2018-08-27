import Location from '@/models/Location'
import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class EntryContactsResource extends Resource {
  ensureReverseRelations (contact) {
    const reverseRelations = super.ensureReverseRelations(contact)

    if (contact.location && contact.location.creatingContactId === contact.id) {
      contact.location.getParentRelations().forEach(relation => {
        const contactOfLocation = relation.owner
        contactOfLocation.getParentRelations().forEach(ownerContactRelation => {
          reverseRelations.add(ownerContactRelation)
        })
      })
      reverseRelations.add(App.getRelationByModel(Location))
    }

    return reverseRelations
  }
}
