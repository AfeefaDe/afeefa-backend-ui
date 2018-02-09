import LoadingState from '@/store/api/LoadingState'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default class Relation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({type, cacheKey, cacheParams, itemType, Model}) {
    this.type = type
    this.cacheKey = cacheKey
    this._cacheParams = cacheParams
    this.cacheParams = JSON.stringify(cacheParams)
    this.itemType = itemType || cacheKey
    this.Model = Model

    this.init()
  }

  init () {
    this.reset()

    // we exclude the update from reset since the initialization of an updated
    // item (after save) resets all relations and hence the flag that notifies
    // us that the afterwards re-initialized relation should be written to cache
    this.cacheUpdateForced = false
  }

  reset () {
    this.json = null
    this.loadingState = LoadingState.FULLY_LOADED
    this.id = null

    // avoid recursions, if a relation has been cached,
    // there is no need to cache eagerly loaded data again,
    // even if we clone the item that holds the relation
    this.syncedWithResourceCache = false

    this.isFetching = false
    this.fetched = false
    this.item = null
    this.items = []
  }

  /**
   * If this flag is set, the initialized item will be written to
   * the resource cache, even if the cached item has the same LoadingState.
   */
  forceCacheUpdate () {
    this.cacheUpdateForced = true
  }

  initWithJson (json, loadingState = LoadingState.FULLY_LOADED) {
    this.json = json
    this.loadingState = loadingState
    if (this.type === Relation.HAS_ONE) {
      this.id = this.json.id
    }
  }

  initWithId (id) {
    this.id = id
  }

  factory (json) {
    const item = new this.Model()
    item.deserialize(json)
    return item
  }

  cache (resourceCache) {
    if (this.syncedWithResourceCache) {
      return
    }
    this.syncedWithResourceCache = true

    if (this.json) {
      // cache item
      if (this.type === Relation.HAS_ONE) {
        const item = this.findOrCreateItem(resourceCache, this.json)
        this.cacheItemRelations(resourceCache, item)
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
      if ((item._loadingState < this.loadingState) || this.cacheUpdateForced) { // update cached item only if the updated version is more comprehensive
        item.deserialize(json) // resets all relations to null or []
        item._loadingState = this.loadingState
        this.cacheUpdateForced = false
      }
    }
    return item
  }

  fetch (callback, strategy = LoadingStrategy.LOAD_IF_NOT_CACHED) {
    // FETCH ITEM
    if (this.type === Relation.HAS_ONE) {
      if (!this.id) {
        return
      }

      if (this.fetched) {
        const wantToFetchMore = strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
          this.item._loadingState < LoadingState.FULLY_LOADED
        if (!wantToFetchMore) {
          return
        }
      }

      if (this.isFetching) {
        const wantToFetchMore = strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
          this.isFetching !== strategy
        if (!wantToFetchMore) {
          return
        }
      }

      this.isFetching = strategy
      callback(this.id).then(item => {
        this.item = item
        this.isFetching = false
        this.fetched = true
      })

    // FETCH LIST
    } else {
      this.isFetching = strategy
      callback().then(items => {
        this.items = items
        this.isFetching = false
        this.fetched = true
      })
    }
  }

  cacheItemRelations (resourceCache, item) {
    for (let name in item.relations) {
      const relation = item.relations[name]
      relation.cache(resourceCache)
    }
  }

  /**
   * A cloned item will also have all relations cloned from it's orginal.
   * The clone item must fetch any relation on its own and hence runs its
   * own process of collecting data - fully independent from the original.
   *
   * In order to fetch the necessary resources of the original, we need to
   * copy initial data json/id as well as (for performance reasons) the
   * hint, if the relation data has already been synced to the resource cache.
   */
  clone () {
    const cacheParams = this.cacheParams ? JSON.parse(this.cacheParams) : undefined
    const clone = new Relation({type: this.type, cacheKey: this.cacheKey, cacheParams, itemType: this.itemType, Model: this.Model})

    if (this.json) {
      clone.initWithJson(this.json, this.loadingState)
    } else {
      clone.initWithId(this.id)
    }

    clone.syncedWithResourceCache = this.syncedWithResourceCache

    return clone
  }
}
