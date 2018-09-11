import Location from '@/models/Location'
import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class EntryContactsResource extends Resource {
  ensureReverseRelationsAfterAddOrSave (contact) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(contact)

    if (contact.location && contact.location.contact_id === contact.id) {
      contact.location.getParentRelations().forEach(relation => {
        const contactOfLocation = relation.owner
        contactOfLocation.getParentRelations().forEach(ownerContactRelation => {
          ensure.add(ownerContactRelation)
        })
      })
      ensure.add(App.getRelationByModel(Location))
    }

    return ensure
  }
}
