import Event from '@/models/Event'
import RouteConfig from '@/services/router/RouteConfig'

export default class Config extends RouteConfig {
  constructor (routeComponent, eventId) {
    super(routeComponent, eventId)

    this.routeName = 'events'
    this.Model = Event
    this.facetOwnerType = 'Event'

    this.messages = {
      // any
      loadingItem: () => this.$t('status.load_event') + ' ' + this.itemId,
      loadingItemError: () => this.$t('errors.loadingEntryError') + ' ' + this.itemId,
      // show
      activateItemDialogTitle: item => {
        return `Event ${item.active ? 'verbergen' : 'veröffentlichen'}`
      },
      activateItemDialogMessage: item => {
        return `Soll das Event "${item.title}" ${item.active ? 'verborgen' : 'veröffentlicht'} werden?`
      },
      activateItemSuccess: item => {
        return `Das Event ${item.active ? 'wurde veröffentlicht' : ' ist nun nicht mehr öffentlich sichtbar'}.`
      },
      // new
      newItem: () => {
        return `Neue Veranstaltung`
      },
      addItemSuccess: () => {
        return `Das Event wurde hinzugefügt.`
      },
      // edit
      deleteItemDialogTitle: () => {
        return `Event löschen`
      },
      deleteItemDialogMessage: item => {
        return `Soll das Event "${item.title}" gelöscht werden?`
      },
      deleteItemSuccess: () => {
        return `Das Event wurde gelöscht.`
      },
      saveItemSuccess: () => {
        return `Das Event wurde gespeichert.`
      }
    }
  }

  entryOwners (entry) {
    return entry.hosts
  }
}
