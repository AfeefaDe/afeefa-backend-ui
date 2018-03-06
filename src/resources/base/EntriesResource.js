import Resource from 'uidata/resource/Resource'

export default class EntriesResource extends Resource {
  transformJsonBeforeSave (json) {
    return {
      data: json
    }
  }

  itemAdded (entry) {
    // new entry added to lists
    this.cachePurgeList(this.getListType(), '{}')
    // new entry may add a todo
    this.cachePurgeList('todos', '{}')
  }

  itemDeleted (entry) {
    // remove old entry from cache
    this.cachePurgeItem(entry.type, entry.id)
    // old entry not in lists any longer
    this.cachePurgeList(this.getListType(), '{}')
    // deleting an entry may change todo list
    this.cachePurgeList('todos', '{}')
  }

  itemSaved (entryOld, entry) {
    // annotation might be changed, entry may (disappear) in todo list
    // invalidate only if first annotation added or last removed
    this.cachePurgeList('todos', '{}')
  }
}

