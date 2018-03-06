<template>
  <power-selector
    :items="facet.facet_items"
    :selected-items="selectedFacetItems"
    :search-fields="['title']"
    @select="addFacetItem"
    @remove="removeFacetItem"
    :messages="messages">
    <div slot="selected-item" slot-scope="props">
      <div>{{ props.item.title }}</div>
    </div>
    <div slot="item" slot-scope="props">
      <div>{{ props.item.title }}</div>
    </div>
  </power-selector>
</template>

<script>
import PowerSelector from '@/components/PowerSelector'

export default {
  props: ['owner', 'facet'],

  data () {
    return {
      messages: {
        addButtonTitle: `${this.facet.title} hinzufügen`,
        removeTitle: `${this.facet.title} entfernen`,
        removeMessage: actor => {
          return `Soll der Akteur ${actor.title} dieses Item nicht mehr haben?`
        }
      }
    }
  },

  computed: {
    selectedFacetItems () {
      return this.facet.facet_items.filter(item => {
        return this.owner.facet_items.includes(item)
      })
    }
  },

  methods: {
    addFacetItem (facetItem) {
      this.owner.$rels.facet_items.attach(facetItem).then(result => {
        if (result) {
          this.owner.facet_items.push(facetItem)
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde hinzugefügt'
          })
        }
      })
    },

    removeFacetItem (facetItem) {
      this.owner.$rels.facet_items.detach(facetItem).then(result => {
        if (result) {
          this.owner.facet_items = this.owner.facet_items.filter(n => n.id !== facetItem.id)
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde entfernt'
          })
        }
      })
    }
  },

  components: {
    PowerSelector
  }
}
</script>
