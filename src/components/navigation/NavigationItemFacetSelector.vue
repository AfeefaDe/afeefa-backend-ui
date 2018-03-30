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
  props: ['navigationItem', 'facet'],

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
        return this.navigationItem.facet_items.includes(item)
      })
    }
  },

  methods: {
    addFacetItem (facetItem) {
      this.navigationItem.$rels.owners.Query.attach(facetItem).then(result => {
        if (result) {
          this.navigationItem.facet_items.push(facetItem)
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde hinzugefügt'
          })
        }
      })
    },

    removeFacetItem (facetItem) {
      this.navigationItem.$rels.owners.Query.detach(facetItem).then(result => {
        if (result) {
          this.navigationItem.facet_items = this.navigationItem.facet_items.filter(n => n.id !== facetItem.id)
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
