import store from '@/store'

export default class BaseResource {
  constructor () {
    this.init(arguments)
  }

  init () {
  }

  /**
   * Config
   */

  /**
   * Since Search or Todos resources return lists of mixed items
   * we need to decide what resource cache key is to be
   * used based on the actual item's type.
   * @see Search or Todos resources
   */
  getItemCacheKey (json) {
    return this.listCacheKey
  }

  getItemCacheId (json) {
    return json.id
  }

  // creates a new model based on the given json response
  // @see Todos or Search
  createItem (json) {
  }

  // transforms the given list prior to caching
  // useful to create a hierachical list from a flat list
  // e.g. for cateories
  transformList (items) {
  }

  // deserialized the current item
  // @see Todos or Search
  deserialize (item, json) {
    this.deserializeItem(item, json)
  }

  // hook to override if special deserialization code
  // is provided. @see Todos or Search
  deserializeItem (item, json) {
    item.deserialize(json)
  }

  // caches eagerly loaded relations
  cacheEagerLoadedRelations (item) {
    const resourceCache = store.state.api.resourceCache
    for (let name in item.relations) {
      const relation = item.relations[name]
      relation.cache(resourceCache)
    }

    this.initEagerLoadedRelations(item)
  }

  // pushes eagerly loaded relation data into
  // the resource cache
  initEagerLoadedRelations (item) {
  }

  /**
   * Api Hooks
   */

  // called after an item has been added
  // to enable custom resource cache treatment
  itemAdded (item) {
  }

  // called after an item has been deleted
  // to enable custom resource cache treatment
  itemDeleted (item) {
  }

  // called after an item has been changed
  // to enable custom resource cache treatment
  // use the old item to access the item relations
  // that have been present prior saving
  itemSaved (itemOld, item) {
  }

  // called after attributes of an item have been changed
  // to enable custom resource cache treatment
  itemAttributesUpdated (item, attributes) {
  }

  /**
   * Resource Cache Access
   */

  cachePurgeList (key, url) {
    const resourceCache = store.state.api.resourceCache
    resourceCache.purgeList(key, url)
  }

  cachePurgeItem (key, id) {
    const resourceCache = store.state.api.resourceCache
    resourceCache.purgeItem(key, id)
  }

  cacheGetAllLists (key) {
    const resourceCache = store.state.api.resourceCache
    return resourceCache.getCache(key).lists
  }

  cacheGetAllItems (key) {
    const resourceCache = store.state.api.resourceCache
    return resourceCache.getCache(key).items
  }

  findCachedItem (key, id) {
    const resourceCache = store.state.api.resourceCache
    return resourceCache.getItem(key, id)
  }
}
