import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class EntriesResource extends Resource {
  ensureReverseRelationsAfterAddOrSave (entry) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(entry)
    if (entry.annotations.length) {
      ensure.add(App.getRelationByType('todos'))
    }
    return ensure
  }
}
