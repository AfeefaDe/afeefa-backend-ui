import store from '@/store'

export default class Resource {
  constructor () {
    this.init(arguments)
  }

  init () {
  }

  /**
   * Resource Config
   */

  /**
   * Since Search or Todos resources return lists of mixed items
   * we need to decide what resource cache key is to be
   * used based on the actual item's type.
   * @see Search or Todos resources
   */
  getItemType (json) {
    return this.listType
  }

  getItemId (json) {
    return json.id
  }

  getItemJson (json) {
    return json
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

  /**
   * Api Hooks
   */

  // called after the json of an item has been loaded
  // to enable modicificatoins on the json
  itemJsonLoaded (json) {
  }

  // called after an item has been added
  // to enable custom resource cache treatment
  itemAdded (item) {
  }

  // called after an item has been deleted
  // to enable custom resource cache treatment
  itemDeleted (item) {
  }

  itemSaved (itemOld, item) {
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
