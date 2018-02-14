import Orga from '@/models/Orga'
import RouteConfig from '@/services/router/RouteConfig'

export default class Config extends RouteConfig {
  constructor (routeComponent, orgaId) {
    super(routeComponent, orgaId)

    this.routeName = 'orgas'
    this.Resource = Orga

    this.messages = {
      // any
      loadingItem: () => this.$t('status.load_orga') + ' ' + this.itemId,
      loadingItemError: () => this.$t('errors.loadingEntryError') + ' ' + this.itemId,
      // show
      activateItemDialogTitle: item => {
        return `Orga ${item.active ? 'verbergen' : 'veröffentlichen'}`
      },
      activateItemDialogMessage: item => {
        return `Soll die Orga "${item.title}" ${item.active ? 'verborgen' : 'veröffentlicht'} werden?`
      },
      activateItemSuccess: item => {
        return `Die Orga ${item.active ? 'wurde veröffentlicht' : 'ist nun nicht mehr öffentlich sichtbar'}.`
      },
      // new
      addItemSuccess: () => {
        return `Die Orga wurde hinzugefügt.`
      },
      // edit
      deleteItemDialogTitle: () => {
        return `Orga löschen`
      },
      deleteItemDialogMessage: item => {
        return `Soll die Orga "${item.title}" gelöscht werden?`
      },
      deleteItemSuccess: () => {
        return `Die Orga wurde gelöscht.`
      },
      saveItemSuccess: () => {
        return `Die Orga wurde gespeichert.`
      }
    }
  }
}
