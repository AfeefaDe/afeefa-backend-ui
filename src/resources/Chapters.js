import Vue from 'vue'
import { BASE } from '@/store/api'
import Resource from './base/Resource'
import Chapter from '@/models/Chapter'
import Query from './base/Query'

class ChaptersResource extends Resource {
  init () {
    this.url = 'chapters'
    this.http = Vue.resource(BASE + this.url + '{/id}')
    this.listType = 'chapters'
  }

  getItemModel () {
    return Chapter
  }

  itemAdded () {
    this.cachePurgeList('chapters')
  }

  itemDeleted (chapter) {
    this.cachePurgeItem('chapters', chapter.id)
    this.cachePurgeList('chapters')
  }
}

class Chapters extends Query {
  getApi () {
    return ['getAll', 'get', 'save', 'delete']
  }

  createResource () {
    return new ChaptersResource()
  }

  save (chapter) {
    return super.save(chapter, {wrapInDataProperty: false})
  }
}

export default new Chapters()
