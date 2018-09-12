import App from 'uidata/model/App'
import Resource from 'uidata/resource/Resource'

export default class EntryAnnotationsResource extends Resource {
  ensureReverseRelationsAfterAddOrSave (annotation) {
    const ensure = super.ensureReverseRelationsAfterAddOrSave(annotation)

    const entry = this.relation.owner
    if (entry.annotations.length) {
      ensure.add(App.getRelationByType('todos'))
    }

    return ensure
  }
}
