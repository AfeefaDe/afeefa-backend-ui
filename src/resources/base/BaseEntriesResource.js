import BaseResource from './BaseResource'

export default class BaseEntriesResource extends BaseResource {
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

  itemSaved (entryOld, entry) {
    // entry attributes may change and reorder lists
    this.cachePurgeList(this.listCacheKey)
    // annotation might be changed, entry may (disappear) in todo list
    this.cachePurgeList('todos')
    // annotation detail might be changed
    for (let annotation of entryOld.annotations) {
      this.cachePurgeItem('annotations', annotation.id)
    }
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

