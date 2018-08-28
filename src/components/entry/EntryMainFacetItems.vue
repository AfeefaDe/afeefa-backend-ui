<template>
  <div :class="['editableEntryFacetItems', {empty: !facetItems.length}]">
    <entry-facet-items :items="facetItems" v-if="facetItems.length" />
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import EntryFacetItems from '@/components/entry/EntryFacetItems'

export default {
  props: ['entry'],

  data () {
    return {
      facetItems: []
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      const mainFacet = facets.find(facet => facet.main_facet_of === this.entry.facetOwnerType)
      if (mainFacet) {
        this.facetItems = this.entry.facet_items.filter(fi => fi.facet === mainFacet)
      }
    })
  },

  components: {
    EntryFacetItems
  }
}
</script>
