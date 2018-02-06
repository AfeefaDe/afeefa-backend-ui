export default class CachedRelation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({attribute, type, cacheKey}) {
    this.attribute = attribute
    this.type = type
    this.cacheKey = cacheKey

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
      let item = resourceCache.getItem(this.cacheKey, this.json.id)
      if (!item) {
        item = this.factory(this.json)
        resourceCache.addItem(this.cacheKey, item)
      } else {
        item.deserialize(this.json)
      }
    }
  }

  clone () {
    const clone = new CachedRelation({attribute: this.attribute, type: this.type, cacheKey: this.cacheKey})
    clone.json = this.json
    clone.factory = this.factory
    return clone
  }
}
