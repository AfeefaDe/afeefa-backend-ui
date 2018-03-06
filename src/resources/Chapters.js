import Chapter from '@/models/Chapter'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'

class ChaptersResource extends Resource {
  init () {
    this.url = 'chapters{/id}'
    this.Model = Chapter
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
  getResource () {
    return new ChaptersResource()
  }

  save (chapter) {
    return super.save(chapter, {wrapInDataProperty: false})
  }
}

export default new Chapters()
