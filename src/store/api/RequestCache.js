const _cache = {}

export default class RequestCache {
  addItem (key, promise) {
    _cache[key] = promise

    promise.then(result => {
      delete _cache[key]
    }).catch(e => {
      delete _cache[key]
    })
  }

  hasItem (key) {
    return _cache[key] !== undefined
  }

  getItem (key) {
    return _cache[key]
  }

  purgeItem (key) {
    delete _cache[key]
  }
}
