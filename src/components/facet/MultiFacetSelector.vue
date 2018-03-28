<template>
  <power-selector
    :items="facet.facet_items"
    :selected-items="[]"
    :search-fields="['title']"
    @select="addFacetItem"
    :messages="messages">
    <div slot="item" slot-scope="props">
      <div>{{ props.item.title }}</div>
    </div>
  </power-selector>
</template>

<script>
import PowerSelector from '@/components/PowerSelector'

export default {
  props: ['owners', 'facet'],

  data () {
    return {
      messages: {
        addButtonTitle: `${this.facet.title} hinzufügen`
      }
    }
  },

  computed: {
  },

  methods: {
    addFacetItem (facetItem) {
      facetItem.$rels.owners.Query.attachMany(this.owners).then(result => {
        if (result) {
          this.owners.forEach(owner => {
            owner.facet_items.push(facetItem)
          })
          this.$store.dispatch('messages/showAlert', {
            description: 'Die Facette wurde hinzugefügt'
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
