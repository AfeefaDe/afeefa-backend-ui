import Orga from '@/models/Orga'
import RouteConfig from '@/services/router/RouteConfig'

export default class Config extends RouteConfig {
  constructor (routeComponent, orgaId) {
    super(routeComponent, orgaId)

    this.routeName = 'orgas'
    this.Model = Orga
    this.facetOwnerType = 'Orga'

    this.messages = {
      // any
      loadingItem: () => this.$t('status.load_orga') + ' ' + this.itemId,
      loadingItemError: () => this.$t('errors.loadingEntryError') + ' ' + this.itemId,
      // show
      activateItemDialogTitle: item => {
        return `Akteur ${item.active ? 'verbergen' : 'veröffentlichen'}`
      },
      activateItemDialogMessage: item => {
        return `Soll der Akteur "${item.title}" ${item.active ? 'verborgen' : 'veröffentlicht'} werden?`
      },
      activateItemSuccess: item => {
        return `Der Akteur ${item.active ? 'wurde veröffentlicht' : 'ist nun nicht mehr öffentlich sichtbar'}.`
      },
      // new
      newItem: () => {
        return `Neuer Akteur`
      },
      addItemSuccess: () => {
        return `Der Akteur wurde hinzugefügt.`
      },
      // edit
      deleteItemDialogTitle: () => {
        return `Akteur löschen`
      },
      deleteItemDialogMessage: item => {
        return `Soll der Akteur "${item.title}" gelöscht werden?`
      },
      deleteItemSuccess: () => {
        return `Der Akteur wurde gelöscht.`
      },
      saveItemSuccess: () => {
        return `Der Akteur wurde gespeichert.`
      }
    }
  }

  entryOwners (entry) {
    return entry.project_initiators
  }
}
