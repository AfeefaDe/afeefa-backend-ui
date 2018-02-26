import store from '@/store'
import LoadingStrategy from '@/store/api/LoadingStrategy'
import LoadingState from '@/store/api/LoadingState'

let ID = 0

export default class Relation {
  static HAS_ONE = 'has_one'
  static HAS_MANY = 'has_many'
  static ASSOCIATION_COMPOSITION = 'composition'
  static ASSOCIATION_LINK = 'link'

  constructor ({owner, name, type, Model, associationType}) {
    if (!type || !Model) {
      console.error('Relation configuration invalid', ...arguments)
    }

    if (!associationType) {
      associationType = Relation.ASSOCIATION_LINK
    }

    this.owner = owner
    this.name = name
    this.type = type
    this.Model = Model
    this.associationType = associationType

    this.instanceId = ++ID
    this.isClone = false
    this.original = null

    this.reset()
  }

  reset () {
    // id of a has_one relation, may be accompanied by json data but does not need to
    this.id = null

    // avoid recursions, if a relation has been cached,
    // there is no need to cache its data again,
    // even if we clone the item that holds the relation
    this.hasIncludedData = false
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

    this.isFetching = false
    this.fetched = false
    this.invalidated = true

    if (this.original) {
      this.original.purgeFromCacheAndMarkInvalid()
    }
  }

  listParams () {
    return {
      owner_type: this.owner.type,
      owner_id: this.owner.id,
      relation: this.name
    }
  }

  deserialize (json) {
    this.reset()

    json = json.hasOwnProperty('data') ? json.data : json // jsonapi-spec fallback

    const resourceCache = store.state.api.resourceCache

    // cache item
    if (this.type === Relation.HAS_ONE) {
      // if no json given -> related object === null
      if (json) {
        this.id = json.id
        this.findOrCreateItem(json)
      }
    // cache list
    } else {
      const items = []
      json.forEach(json => {
        const item = this.findOrCreateItem(json)
        items.push(item)
      })
      const listParams = JSON.stringify(this.listParams())
      resourceCache.addList(this.Model.type, listParams, items)
    }

    this.hasIncludedData = true
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
      Model: this.Model,
      associationType: this.associationType
    })

    clone.id = this.id
    clone.hasIncludedData = this.hasIncludedData
    clone.isClone = true
    clone.original = this

    return clone
  }

  get info () {
    const isClone = this.isClone ? '(CLONE)' : ''
    const itemId = this.type === Relation.HAS_ONE ? `itemId="${this.id}" ` : ''
    return `[Relation] id="${this.instanceId}${isClone}" owner="${this.owner.type}(${this.owner.id})" type="${this.type}" name="${this.name}" ` +
      `${itemId}hasIncludedData="${this.hasIncludedData}" fetched="${this.fetched}" invalidated="${this.invalidated}"`
  }
}
