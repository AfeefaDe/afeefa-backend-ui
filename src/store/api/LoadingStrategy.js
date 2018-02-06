export default class LoadingStrategy {
  // loads items if they are not fully loaded
  static RETURN_CACHED_IF_FULLY_LOADED_OR_LOAD = 1
  // does not load if a cached item has been found
  static RETURN_CACHED_OR_LOAD = 2
  // returns null or [] if not cached
  static RETURN_CACHED_OR_EMPTY = 3
}
