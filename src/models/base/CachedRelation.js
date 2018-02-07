export default class CachedRelation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({type, cacheKey, cacheParams}) {
    this.type = type
    this.cacheKey = cacheKey
    this.cacheParams = JSON.stringify(cacheParams)

    this.json = null
    this.factory = null
  }

  initWithJson (json, factory) {
    this.json = json
    this.factory = factory
  }

  get itemId () {
    if (this.type === CachedRelation.HAS_ONE && this.json) {
      return this.json.id
    }
    return null
  }

  cache (resourceCache) {
    if (this.json) {
      if (this.type === CachedRelation.HAS_ONE) {
        let item = resourceCache.getItem(this.cacheKey, this.json.id)
        if (!item) {
          item = this.factory(this.json)
          resourceCache.addItem(this.cacheKey, item)
        } else {
          item.deserialize(this.json)
        }
        this.cacheItemRelations(resourceCache, item)
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
    return clone
  }
}
