import Resource from 'uidata/resource/Resource'

export default class EntriesResource extends Resource {
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
