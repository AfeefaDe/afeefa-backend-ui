import FacetItem from '@/models/FacetItem'
import store from '@/store'
import { BASE } from '@/store/api'
import Query from 'data/resource/Query'
import Resource from 'data/resource/Resource'
import Vue from 'vue'

class FacetItemsResource extends Resource {
  init (relation) {
    // owner can be a facet or an actor/event
    this.owner = relation.owner

    this.url = `${this.owner.type}/${this.owner.id}/facet_items{/id}`
    this.http = Vue.resource(BASE + this.url, {}, {update: {method: 'PATCH'}})
  }

  getItemModel () {
    return FacetItem
  }

  itemAdded (facetItem) {
    // order reload of the facets facet_items by the next get() call
    this.cachePurgeRelation(this.owner.relation('facet_items'))
  }

  itemDeleted (facetItem) {
    // order reload of the facets facet_items by the next get() call
    this.cachePurgeRelation(this.owner.relation('facet_items'))
    // order reload of the entries facet items by the next get() call
    // TODO
    // remove the facet item from cache
    this.cachePurgeItem('facet_items', facetItem.id)
  }
}

class Facets extends Query {
  getApi () {
    return ['forRelation', 'save', 'delete', 'attachToOwner', 'detachFromOwner']
  }

  createResource ({relation}) {
    return new FacetItemsResource(relation)
  }

  save (facet) {
    return super.save(facet, {wrapInDataProperty: false})
  }

  attachToOwner (owner, facetItem) {
    const resource = Vue.resource(BASE + `${owner.type}/${owner.id}/facet_items{/facet_item_id}`)
    return resource.save({
      facet_item_id: facetItem.id
    }, {}).then(() => {
      owner.relation('facet_items').purgeFromCacheAndMarkInvalid()
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
      owner.relation('facet_items').purgeFromCacheAndMarkInvalid()
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

export default new Facets()
