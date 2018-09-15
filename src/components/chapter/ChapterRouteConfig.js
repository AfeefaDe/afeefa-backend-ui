import Chapter from '@/models/Chapter'
import RouteConfig from '@/services/router/RouteConfig'

export default class Config extends RouteConfig {
  constructor (routeComponent, chapterId) {
    super(routeComponent, chapterId)

    this.routeName = 'chapters'
    this.Model = Chapter
    this.facetOwnerType = 'Chapter'

    this.messages = {
      // any
      loadingItem: () => this.$t('status.load_chapter') + ' ' + this.itemId,
      loadingItemError: () => this.$t('errors.loadingChapterError') + ' ' + this.itemId,

      // show
      activateItemDialogTitle: item => {
        return `Angebot ${item.active ? 'verbergen' : 'veröffentlichen'}`
      },
      activateItemDialogMessage: item => {
        return `Soll das Angebot "${item.title}" ${item.active ? 'verborgen' : 'veröffentlicht'} werden?`
      },
      activateItemSuccess: item => {
        return `Das Angebot ${item.active ? 'wurde veröffentlicht' : ' ist nun nicht mehr öffentlich sichtbar'}.`
      },

      // new
      newItem: () => {
        return this.$t('chapters.newChapter')
      },
      addItemSuccess: () => {
        return `Das Angebot wurde hinzugefügt.`
      },

      // edit
      deleteItemDialogTitle: () => {
        return `Angebot löschen`
      },
      deleteItemDialogMessage: item => {
        return `Soll das Angebot "${item.title}" gelöscht werden?`
      },
      deleteItemSuccess: () => {
        return `Das Angebot wurde gelöscht.`
      },
      saveItemSuccess: () => {
        return `Das Angebot wurde gespeichert.`
      }
    }
  }

  entryOwners (entry) {
    return entry.owners
  }
}
