import Resource from 'uidata/resource/Resource'

export default class EntriesResource extends Resource {
  transformJsonBeforeSave (json) {
    return {
      data: json
    }
  }

  itemAdded (entry) {
    super.itemAdded(entry)
    // new entry may add a todo
    this.cachePurgeList('todos', '{}')
  }

  itemDeleted (entry) {
    super.itemDeleted(entry)
    // deleting an entry may change todo list
    this.cachePurgeList('todos', '{}')
  }

  itemSaved (entryOld, entry) {
    super.itemSaved(entryOld, entry)
    // annotation might be changed, entry may (disappear) in todo list
    // invalidate only if first annotation added or last removed
    this.cachePurgeList('todos', '{}')
  }
}

