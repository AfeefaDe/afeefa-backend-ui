export default class ResourceCache {

  constructor () {
    this.cache = {}
  }

  getCache (key) {
    if (!this.cache[key]) {
      this.cache[key] = {
        lists: {},
        items: {}
      }
    }
    return this.cache[key]
  }

  addList (key, url, list) {
    const listCache = this.getCache(key).lists
    listCache[url] = list
    for (let item of list) {
      this.addItem(item.type, item)
    }
  }

  hasList (key, url) {
    return this.getCache(key).lists[url] !== undefined
  }

  getList (key, url) {
    return this.getCache(key).lists[url]
  }

  purgeList (key, url) {
    if (url) {
      delete this.getCache(key).lists[url]
    } else {
      this.getCache(key).lists = {}
    }
  }

  addItem (key, item) {
    const itemCache = this.getCache(key).items
    itemCache[item.id] = item
  }

  hasItem (key, id) {
    return this.getCache(key).items[id] !== undefined
  }

  getItem (key, id) {
    return this.getCache(key).items[id]
  }

  purgeItem (key, id) {
    delete this.getCache(key).items[id]
  }
}
