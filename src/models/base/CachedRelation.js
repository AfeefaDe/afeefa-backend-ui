export default class CachedRelation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({type, cacheKey, cacheParams, loadingState}) {
    this.type = type
    this.cacheKey = cacheKey
    this.cacheParams = JSON.stringify(cacheParams)
    this.loadingState = loadingState

    this.json = null
    this.factory = null

    this.id = null
    this.ids = null

    // avoid recursions, if a relation has been cached,
    // there is no need to cache eagerly loaded data again,
    // even if we clone the item that holds the relation
    this.cached = false
  }

  initWithJson (json, factory) {
    this.json = json

    if (this.json && this.type === CachedRelation.HAS_ONE) {
      this.id = this.json.id
    }
    this.factory = factory
  }

  initWithId (id) {
    this.id = id
  }

  initWithIds (ids) {
    this.ids = ids
  }

  cache (resourceCache) {
    if (this.cached) {
      return
    }
    this.cached = true

    if (this.json) {
      // cache item
      if (this.type === CachedRelation.HAS_ONE) {
        let item = resourceCache.getItem(this.cacheKey, this.json.id)
        if (!item) {
          item = this.factory(this.json)
          item._loadingState = this.loadingState
          resourceCache.addItem(this.cacheKey, item)
        } else {
          if (item._loadingState < this.loadingState) {
            item.deserialize(this.json)
            item._loadingState = this.loadingState
          }
        }
        this.cacheItemRelations(resourceCache, item)
      // cache list
      } else {
        const items = this.factory(this.json)
        resourceCache.addList(this.cacheKey, this.cacheParams, items)
        items.forEach(item => {
          this.cacheItemRelations(resourceCache, item)
        })
      }
    }
  }

  cacheItemRelations (resourceCache, item) {
    for (let name in item.relations) {
      const relation = item.relations[name]
      relation.cache(resourceCache)
    }
  }

  clone () {
    const clone = new CachedRelation({type: this.type, cacheKey: this.cacheKey, cacheParams: this.cacheParams})
    clone.json = this.json
    clone.factory = this.factory

    clone.id = this.id
    clone.ids = this.ids

    clone.cached = this.cached
    return clone
  }
}
