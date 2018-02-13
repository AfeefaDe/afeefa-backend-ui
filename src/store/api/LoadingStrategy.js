export default class LoadingStrategy {
  // loads items if they are not fully loaded
  static LOAD_IF_NOT_FULLY_LOADED = 2
  // does not load if a cached item has been found
  static LOAD_IF_NOT_CACHED = 1
}
