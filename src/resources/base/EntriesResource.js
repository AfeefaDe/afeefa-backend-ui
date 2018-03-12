import ModelResource from 'uidata/resource/ModelResource'

export default class EntriesResource extends ModelResource {
  transformJsonBeforeSave (json) {
    return {
      data: json
    }
  }

  itemSaved (entryOld, entry) {
    super.itemSaved(entryOld, entry)

    // has now annotations or does not have annotations any longer
    if (entry.annotations.length === entryOld.annotations.length + entry.annotations.length) {
      this.cachePurgeList('todos', '{}')
    }
  }
}
