import Chapter from '@/models/Chapter'
import Query from 'uidata/resource/Query'
import Resource from 'uidata/resource/Resource'

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
}

export default new Chapters()
