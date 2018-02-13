import LoadingState from '@/store/api/LoadingState'
import LoadingStrategy from '@/store/api/LoadingStrategy'

export default class Relation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({owner, type, listType, listParams, itemType, Model, data, loadingState}) {
    this.owner = owner
    this.type = type
    this.listType = listType
    this.listParams = listParams || (() => '') // empty object
    this.itemType = itemType || listType
    this.Model = Model
    this.data = data || (() => null) // no data
    this.loadingState = loadingState

    this.init()
  }

  init () {
    this.reset()
  }

  reset () {
    this.json = null
    this.id = null

    // avoid recursions, if a relation has been cached,
    // there is no need to cache eagerly loaded data again,
    // even if we clone the item that holds the relation
    this.syncedWithResourceCache = false

    this.initialized = false
    this.isFetching = false
    this.fetched = false
    this.item = null
    this.items = []
  }

  initWithJson (json) {
    this.json = json
    if (this.json && this.type === Relation.HAS_ONE) {
      this.id = this.json.id
    }
    this.syncedWithResourceCache = false
    this.initialized = true
  }

  initWithId (id) {
    this.id = id
    this.syncedWithResourceCache = false
    this.initialized = true
  }

  factory (json) {
    const item = new this.Model()
    item.deserialize(json)
    item._loadingState = this.loadingState
    return item
  }

  cache (resourceCache) {
    // not initialized, no need to cache
    if (!this.initialized) {
      return
    }

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
        const listParams = JSON.stringify(this.listParams(this.owner))
        resourceCache.addList(this.listType, listParams, items)
      }
    }
  }

  findOrCreateItem (resourceCache, json) {
    let item = resourceCache.getItem(this.itemType, json.id)
    if (!item) {
      item = this.factory(json)
      resourceCache.addItem(this.itemType, item)
    } else {
      // we want to update our item not multiple times in the same request
      const isSameRequest = json._requestId === item._requestId
      const wantToCacheMore = this.loadingState > item._loadingState
      // if (this.listType === 'orgas' && json.id === '4274') {
      //   console.log('--- wanttofetchmore', this.loadingState, item._loadingState, wantToCacheMore)
      // }
      if (wantToCacheMore || !isSameRequest) {
        item.deserialize(json)
        item._loadingState = Math.max(item._loadingState, this.loadingState)
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
        // fetch again if we want do fully load but havent yet
        const wantToFetchMore = strategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
          this.item._loadingState < LoadingState.FULLY_LOADED
        if (!wantToFetchMore) {
          return
        }
      }

      if (this.isFetching) {
        // fetch additionally if we want to fetch more detailed data
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
    const clone = new Relation({
      owner: this.owner,
      type: this.type,
      listType: this.listType,
      listParams: this.listParams,
      itemType: this.itemType,
      Model: this.Model,
      data: this.data,
      loadingState: this.loadingState
    })

    if (this.json) {
      clone.initWithJson(this.json)
    } else {
      clone.initWithId(this.id)
    }

    clone.initialized = this.initialized
    clone.syncedWithResourceCache = this.syncedWithResourceCache

    return clone
  }
}
