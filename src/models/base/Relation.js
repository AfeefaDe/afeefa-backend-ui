import store from '@/store'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import LoadingState from '@/store/api/LoadingState'

let ID = 0

export default class Relation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'

  constructor ({owner, name, type, Model}) {
    if (!type || !Model) {
      console.error('Relation configuration invalid', ...arguments)
    }
    this.owner = owner
    this.name = name
    this.type = type
    this.Model = Model

    this.instanceId = ++ID
    this.isClone = false

    this.init()
  }

  init () {
    this.reset()
  }

  reset () {
    this.json = null
    this.id = null

    this.hasDataToCache = false
    // avoid recursions, if a relation has been cached,
    // there is no need to cache eagerly loaded data again,
    // even if we clone the item that holds the relation
    this.cached = false
    this.isFetching = false
    this.fetched = false
    this.invalidated = false
  }

  purgeFromCacheAndMarkInvalid () {
    const resourceCache = store.state.api.resourceCache
    if (this.type === Relation.HAS_ONE) {
      if (this.id) {
        resourceCache.purgeItem(this.Model.type, this.id)
      }
    } else {
      const listParams = JSON.stringify(this.listParams())
      resourceCache.purgeList(this.Model.type, listParams)
    }

    this.reset()
    this.invalidated = true
  }

  listParams () {
    return {
      owner_type: this.owner.type,
      owner_id: this.owner.id,
      relation: this.name
    }
  }

  initWithJson (json) {
    this.json = json
    if (this.json && this.type === Relation.HAS_ONE) {
      this.id = this.json.id
    }
    this.hasDataToCache = !!this.json
  }

  cache () {
    // not initialized, no need to cache
    if (!this.hasDataToCache) {
      // mark hasOne relations to be cached
      // in order to allow to fetch them afterwards
      // and return 'null' as the value
      if (this.type === Relation.HAS_ONE) {
        this.cached = true
      }
      return
    }

    // already cached
    if (this.cached) {
      return
    }

    // early mark cached, before depending relations may want
    // to cache this relation again
    this.cached = true

    const resourceCache = store.state.api.resourceCache

    // cache item
    if (this.type === Relation.HAS_ONE) {
      const item = this.findOrCreateItem(this.json)
      this.cacheItemRelations(item)
    // cache list
    } else {
      const items = []
      this.json.forEach(json => {
        const item = this.findOrCreateItem(json)
        items.push(item)
      })
      items.forEach(item => {
        this.cacheItemRelations(item)
      })
      const listParams = JSON.stringify(this.listParams())
      resourceCache.addList(this.Model.type, listParams, items, this.json)
    }
  }

  findOrCreateItem (json) {
    const resourceCache = store.state.api.resourceCache
    let item = resourceCache.getItem(this.Model.type, json.id)
    if (!item) {
      item = new this.Model()
      item.id = json.id
      resourceCache.addItem(this.Model.type, item)
    }
    item.deserialize(json)
    return item
  }

  cacheItemRelations (item) {
    for (let name in item.relations) {
      const relation = item.relations[name]
      relation.cache()
    }
  }

  deserialize (json) {
    this.reset()
    const data = json.hasOwnProperty('data') ? json.data : json // jsonapi-spec fallback

    this.initWithJson(data)
    this.cache()
  }

  fetchHasOne (callback, currentItemState, fetchingStrategy) {
    if (this.fetched) {
      // fetch again if we want do fully load but havent yet
      const wantToFetchMore = fetchingStrategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
        currentItemState < LoadingState.FULLY_LOADED
      if (!wantToFetchMore) {
        return
      }
    }

    if (this.isFetching) {
      // fetch additionally if we want to fetch more detailed data
      const wantToFetchMore = fetchingStrategy === LoadingStrategy.LOAD_IF_NOT_FULLY_LOADED &&
        this.isFetching !== fetchingStrategy
      if (!wantToFetchMore) {
        return
      }
    }

    this.isFetching = fetchingStrategy
    callback(this.id).then(() => {
      this.isFetching = false
      this.fetched = true
      this.invalidated = false
    })
  }

  fetchHasMany (callback) {
    if (this.isFetched) {
      return
    }

    if (this.isFetching) {
      return
    }

    this.isFetching = true
    callback().then(() => {
      this.isFetching = false
      this.fetched = true
      this.invalidated = false
    })
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
      name: this.name,
      type: this.type,
      Model: this.Model
    })


    clone.hasDataToCache = this.hasDataToCache
    clone.cached = this.cached
    clone.isClone = true

    clone.initWithJson(this.json)

    return clone
  }

  get info () {
    const isClone = this.isClone ? '(CLONE)' : ''
    return `[Relation] id="${this.instanceId}${isClone}" owner="${this.owner.type}(${this.owner.id})" type="${this.type}" name="${this.name}" ` +
      `hasData="${this.hasDataToCache}" cached="${this.cached}" fetched="${this.fetched}" invalidated="${this.invalidated}"`
  }
}
