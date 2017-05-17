export default class BaseResource {
  constructor () {
    this.init(arguments)
  }

  init () {
  }

  /**
   * Since Search or Todos resources return lists of mixed items
   * we need to decide what resource cache key is to be
   * used based on the actual item's type.
   * @see Search or Todos resources
   */
  getItemCacheKey () {
    return this.listCacheKey
  }

  // creates a new model based on the given json response
  // @see Todos or Search
  createItem (json) {
  }

  // deserialized the current item
  // @see Search
  // @see Todos or Search
  deserialize (item, json) {
    item.deserialize(json)
  }

}
