<template>
  <div class="filterLinks">
    <div class="showSelectorLink">
      <facet-selector>
        <div class="selectorLinkIcon">
          <i class="material-icons">settings</i>
          <span class="selectedFacetsHint" v-if="countSelectedFilters">{{ countSelectedFilters }} </span>
        </div>
      </facet-selector>
    </div>

    <filter-selector v-if="selectedFacets.length || navigationIsSelected">
      <div class="selectorLinkIcon">
        <i class="material-icons">filter_list</i>
        <span class="selectedFacetsHint" v-if="countSelectedFilterItems">{{ countSelectedFilterItems }} </span>
      </div>
    </filter-selector>
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import { mapState } from 'vuex'
import FacetSelector from '@/components/entry/list/filterbar/FacetSelector'
import FilterSelector from '@/components/entry/list/filterbar/FilterSelector'

export default {
  created () {
    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('facetFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,

      navigationIsSelected: state => state.facetFilters.navigationIsSelected,
      selectedNavigationItem: state => state.facetFilters.selectedNavigationItem,

      facetItemFilters: state => state.facetFilters.facetItemFilters
    }),

    countSelectedFilters () {
      return this.selectedFacets.length + (this.navigationIsSelected ? 1 : 0)
    },

    countSelectedFilterItems () {
      return this.facetItemFilters.length + (this.selectedNavigationItem ? 1 : 0)
    }
  },

  components: {
    FacetSelector,
    FilterSelector
  }
}
</script>


<style lang="scss" scoped>
.filterLinks {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  i {
    font-size: 30px;
    color: $gray50;
  }

  i:hover {
    color: $gray80;
  }

  > :first-child {
    margin-right: 1em;
  }

  > :last-child {
    margin-right: .5em;
  }

  .selectorLinkIcon {
    position: relative;
  }

  .selectedFacetsHint {
    display: block;
    background-color: $gray80;
    // border: 1px solid $gray20;
    color: $white;
    font-size: .8em;
    line-height: 1;
    padding: .2em .3em;
    border-radius: .3em;
    position: absolute;
    top: -.4em;
    right: -.6em;
  }
}
</style>
