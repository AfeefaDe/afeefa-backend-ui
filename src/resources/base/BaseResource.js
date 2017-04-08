export default class BaseResource {
  constructor () {
    this.api_type = null

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
}
