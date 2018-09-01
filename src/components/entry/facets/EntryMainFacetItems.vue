<template>
  <div :class="['editableEntryFacetItems', {empty: !facetItems.length}]">
    <entry-facet-items :items="displayedSavedFacetItems" v-if="facetItems.length" />
  </div>
</template>

<script>
import Facet from '@/models/Facet'
import EntryFacetItems from '@/components/entry/facets/EntryFacetItems'
import facetItems from '@/helpers/facet-items'

export default {
  props: ['entry'],

  data () {
    return {
      mainFacet: null,
      facetItems: []
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      this.mainFacet = facets.find(facet => facet.main_facet_of === this.entry.facetOwnerType)
      if (this.mainFacet) {
        this.facetItems = this.entry.facet_items.filter(fi => fi.facet === this.mainFacet)
      }
    })
  },

  computed: {
    displayedSavedFacetItems () {
      return facetItems.getDisplayedFacetItemsForFacets(this.entry.facet_items, [this.mainFacet])
    }
  },

  components: {
    EntryFacetItems
  }
}
</script>
