import Resource from 'uidata/resource/Resource'

export default class ChaptersResource extends Resource {
  url = 'chapters{/id}'

  itemAdded () {
    this.cachePurgeList('chapters')
  }

  itemDeleted (chapter) {
    this.cachePurgeItem('chapters', chapter.id)
    this.cachePurgeList('chapters')
  }
}
