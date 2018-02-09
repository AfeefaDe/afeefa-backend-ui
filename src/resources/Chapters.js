import Vue from 'vue'
import store from '@/store'
import { BASE } from '@/store/api'
import Resource from './base/Resource'
import Chapter from '@/models/Chapter'

class ChaptersResource extends Resource {
  init () {
    this.http = Vue.resource(BASE + 'chapters{/id}')
    this.listCacheKey = 'chapters'
  }

  createItem () {
    return new Chapter()
  }

  itemAdded () {
    this.cachePurgeList('chapters')
  }

  itemDeleted (chapter) {
    this.cachePurgeItem('chapters', chapter.id)
    this.cachePurgeList('chapters')
  }
}

export default {
  getAll () {
    const resource = new ChaptersResource()
    return store.dispatch('api/getList', {resource})
  },

  get (id) {
    const resource = new ChaptersResource()
    return store.dispatch('api/getItem', {resource, id})
  },

  save (chapter) {
    if (chapter.id) {
      return store.dispatch('api/saveItem', {
        resource: new ChaptersResource(),
        item: chapter,
        options: {
          wrapInDataProperty: false
        }
      })
    } else {
      return store.dispatch('api/addItem', {
        resource: new ChaptersResource(),
        item: chapter,
        options: {
          wrapInDataProperty: false
        }
      })
    }
  },

  delete (chapter) {
    return store.dispatch('api/deleteItem', {
      resource: new ChaptersResource(),
      item: chapter
    })
  }
}
