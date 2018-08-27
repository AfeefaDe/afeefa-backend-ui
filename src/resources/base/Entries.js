import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class EntriesResource extends Resource {
  ensureReverseRelations (entry) {
    const reverseRelations = super.ensureReverseRelations(event)
    if (entry.annotations.length) {
      reverseRelations.add(App.getRelationByType('todos'))
    }
    return reverseRelations
  }
}
