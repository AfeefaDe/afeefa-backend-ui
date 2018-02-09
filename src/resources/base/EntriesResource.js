import Resource from './Resource'

export default class EntriesResource extends Resource {
  itemAdded (entry) {
    // new entry added to lists
    this.cachePurgeList(this.listCacheKey)
    // new entry may add a todo
    this.cachePurgeList('todos')
  }

  itemDeleted (entry) {
    // remove old entry from cache
    this.cachePurgeItem(this.listCacheKey, entry.id)
    // old entry not in lists any longer
    this.cachePurgeList(this.listCacheKey)
    // deleting an entry may change todo list
    this.cachePurgeList('todos')
  }

  beforeItemSaved (oldContact, contact) {
    // annotations might be changed and should be rewritten to resource cache
    contact.relation('annotations').forceCacheUpdate()
  }

  itemSaved (entryOld, entry) {
    // entry attributes may change and reorder lists
    this.cachePurgeList(this.listCacheKey)
    // annotation might be changed, entry may (disappear) in todo list
    // invalidate only if first annotation added or last removed
    this.cachePurgeList('todos')
  }

  itemAttributesUpdated (entry, attributes) {
    if (attributes) {
      if ('active' in attributes) {
        entry.active = attributes.active === true
        entry.state_changed_at = new Date(attributes.state_changed_at)
      }
      entry.updated_at = new Date(attributes.updated_at)
    }
  }
}

