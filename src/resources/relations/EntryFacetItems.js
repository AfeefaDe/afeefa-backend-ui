import store from '@/store'
import { BASE } from '@/store/api'
import RelationQuery from 'data/resource/RelationQuery'
import Vue from 'vue'

export default class EntryFacetItems extends RelationQuery {
  getApi () {
    return ['getAll', 'attachToOwner', 'detachFromOwner']
  }

  getSaveOptions () {
    return {
      wrapInDataProperty: false
    }
  }

  attachToOwner (owner, facetItem) {
    const resource = Vue.resource(BASE + `${owner.type}/${owner.id}/facet_items{/facet_item_id}`)
    return resource.save({
      facet_item_id: facetItem.id
    }, {}).then(() => {
      owner.$rels.facet_items.purgeFromCacheAndMarkInvalid()
      return true
    }).catch(response => {
      store.dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Hinzufügen',
        description: `Die Facette ${facetItem.title} konnte nicht hinzugefügt werden.`
      })
      console.log('error attach facet item', response)
      return null
    })
  }

  detachFromOwner (owner, facetItem) {
    const resource = Vue.resource(BASE + `${owner.type}/${owner.id}/facet_items/${facetItem.id}`)
    return resource.delete().then(() => {
      owner.$rels.facet_items.purgeFromCacheAndMarkInvalid()
      return true
    }).catch(response => {
      store.dispatch('messages/showAlert', {
        isError: true,
        title: 'Fehler beim Löschen',
        description: `Die Facette ${facetItem.title} konnte nicht entfernt werden.`
      })
      console.log('error detach facet item', response)
      return null
    })
  }
}
