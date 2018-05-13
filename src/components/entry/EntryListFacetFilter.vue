<template>
  <div :class="{empty: showFilterBar && !facetItemFilters.length}">
    <div v-if="!showFilterBar">
      <a href="" @click.prevent="showFacetFilter">Kategorienfilter anzeigen</a>
    </div>

    <div v-if="facetItemFilters.length">
      <span v-for="facetItem in facetItemFilters" :key="facetItem.id">
        <tree-item-tag
          class="facetFilterTag"
          :treeItem="facetItem"
          :count="false"
          :x="true"
          @click="facetItemClick(facetItem)" />
      </span>
    </div>
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      visible: false,
      facetTreeVisible: false,
      facetForFacetTree: null
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('facetFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,
      showFilterBar: state => state.facetFilters.show,
      facetItemFilters: state => state.facetFilters.facetItemFilters
    })
  },

  methods: {
    showFacetFilter () {
      this.$store.dispatch('facetFilters/show', true)
    },

    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/filteredFacetItemClick', facetItem)
    }
  }
}
</script>


<style lang="scss" scoped>
.treeItemTag.facetFilterTag {
  font-size: 1.1em;
  margin-right: .5em;
  margin-bottom: .4em;
}
</style>
