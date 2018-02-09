import LoadingState from '@/store/api/LoadingState'

export default class CachedRelation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({type, cacheKey, cacheParams, itemType, Model, loadingState = LoadingState.FULLY_LOADED}) {
    this.type = type
    this.cacheKey = cacheKey
    this.cacheParams = JSON.stringify(cacheParams)
    this.itemType = itemType || cacheKey
    this.Model = Model
    this.loadingState = loadingState

    this.json = null
    this.callback = null
    this.id = null

    // avoid recursions, if a relation has been cached,
    // there is no need to cache eagerly loaded data again,
    // even if we clone the item that holds the relation
    this.cached = false
  }

  reset () {
    this.json = null
    this.callback = null
    this.id = null
    this.cached = false
  }

  initWithJson (json, callback) {
    this.json = json
    if (this.type === CachedRelation.HAS_ONE) {
      this.id = this.json.id
    }

    this.callback = callback || (() => {})
  }

  factory (json) {
    const item = new this.Model()
    item.deserialize(json)
    return item
  }

  initWithId (id) {
    this.id = id
  }

  cache (resourceCache) {
    if (this.cached) {
      return
    }
    this.cached = true

    if (this.json) {
      // cache item
      if (this.type === CachedRelation.HAS_ONE) {
        const item = this.findOrCreateItem(resourceCache, this.json)
        this.cacheItemRelations(resourceCache, item)
        this.callback(item)
        // cache list
      } else {
        const items = []
        this.json.forEach(json => {
          const item = this.findOrCreateItem(resourceCache, json)
          items.push(item)
        })
        items.forEach(item => {
          this.cacheItemRelations(resourceCache, item)
        })
        resourceCache.addList(this.cacheKey, this.cacheParams, items)
        this.callback(items)
      }
    }
  }

  findOrCreateItem (resourceCache, json) {
    let item = resourceCache.getItem(this.itemType, json.id)
    if (!item) {
      item = this.factory(json)
      item._loadingState = this.loadingState
      resourceCache.addItem(this.itemType, item)
    } else {
      if ((item._loadingState < this.loadingState) || item.cachingInvalidated) { // update cached item only if the updated version is more comprehensive
        item.deserialize(json) // resets all relations to null or []
        item._loadingState = this.loadingState
      }
    }
    return item
  }

  cacheItemRelations (resourceCache, item) {
    for (let name in item.relations) {
      const relation = item.relations[name]
      relation.cache(resourceCache)
    }
  }

  clone () {
    const cacheParams = this.cacheParams ? JSON.parse(this.cacheParams) : ''
    const clone = new CachedRelation({type: this.type, cacheKey: this.cacheKey, cacheParams, itemType: this.itemType, Model: this.Model})

    clone.json = this.json
    clone.callback = this.callback
    clone.id = this.id
    clone.cached = this.cached

    return clone
  }
}
