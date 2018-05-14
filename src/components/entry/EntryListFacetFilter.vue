<template>
  <div :class="{filters: true, empty: showFilterBar && !facetItemFilters.length}">
    <div class="facetItems">
      <tree-item-tag v-for="facetItem in facetItemFilters" :key="facetItem.id"
        class="facetFilterTag"
        :treeItem="facetItem"
        :count="false"
        :x="true"
        @click="facetItemClick(facetItem)" />
    </div>

    <div class="filterLinks">
      <div class="showSelectorLink">
        <facet-selector>
          <i class="material-icons">list</i>
        </facet-selector>
      </div>

      <facet-item-filter-bar-pop-up v-if="selectedFacets.length">
        <i class="material-icons">filter_list</i>
      </facet-item-filter-bar-pop-up>
    </div>
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import { mapState, mapGetters } from 'vuex'
import FacetSelector from '@/components/facet/FacetSelector'
import FacetItemFilterBarPopUp from '@/components/facet/FacetItemFilterBarPopUp'

export default {
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
  },

  components: {
    FacetSelector,
    FacetItemFilterBarPopUp
  }
}
</script>


<style lang="scss" scoped>
.filters {
  display: flex;
}

.facetItems {
  flex-grow: 1;
}

.filterLinks {
  display: flex;
  justify-content: flex-end;

  i {
    font-size: 2em;
    color: $gray50;
  }

  i:hover {
    color: $gray80;
  }

  > :first-child {
    margin-right: .5em;
  }
}

.treeItemTag.facetFilterTag {
  font-size: 1.1em;
  margin-right: .5em;
  margin-bottom: .4em;
}
</style>
