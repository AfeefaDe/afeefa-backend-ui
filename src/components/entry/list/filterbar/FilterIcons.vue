<template>
  <div :class="['filterLinks', {empty: isEmpty}]">
    <facet-selector v-if="icon === 'facets'">
      <div class="selectorLinkIcon">
        <i class="material-icons">visibility</i>
        <span class="selectedFacetsHint" v-if="countSelectedFilters">{{ countSelectedFilters }} </span>
      </div>
    </facet-selector>

    <div class="selectorLinkIcon" v-if="icon === 'filters'">
      <a ref="trigger" href="" @click.prevent="facetFilterIsOpen = true">
        <i class="material-icons">filter_list</i>
        <span class="selectedFacetsHint" v-if="countSelectedFilterItems">{{ countSelectedFilterItems }} </span>
      </a>
      <pop-up-selector ref="popUp" :trigger="$refs.trigger"
        :diffX="20" :diffY="120" align="left" position="fixed"
        :closeIcon="true"
        @close="facetFilterIsOpen = false"
        v-if="facetFilterIsOpen">
        <div slot-scope="props">
          <filter-selector :popUp="props.popUp" />
        </div>
      </pop-up-selector>
    </div>
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import PopUpSelector from '@/components/PopUpSelector'
import { mapState } from 'vuex'
import FacetSelector from './FacetSelector'
import FilterSelector from './FilterSelector'

export default {
  props: ['icon'],

  data () {
    return {
      facetFilterIsOpen: false
    }
  },

  created () {
    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('entryListFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapState({
      selectedFacets: state => state.entryListFilters.selectedFacets,

      navigationIsSelected: state => state.entryListFilters.navigationIsSelected,
      selectedNavigationItem: state => state.entryListFilters.selectedNavigationItem,
      selectedActiveState: state => state.entryListFilters.selectedActiveState,

      facetItemFilters: state => state.entryListFilters.facetItemFilters
    }),

    countSelectedFilters () {
      return this.selectedFacets.length + (this.navigationIsSelected ? 1 : 0)
    },

    countSelectedFilterItems () {
      return this.facetItemFilters.length + (this.selectedNavigationItem ? 1 : 0) + (this.selectedActiveState.value !== 'all' ? 1 : 0)
    },

    isEmpty () {
      return this.icon === 'filters' && !this.countSelectedFilters
    }
  },

  components: {
    FacetSelector,
    FilterSelector,
    PopUpSelector
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
    cursor: pointer;
  }

  .selectedFacetsHint {
    display: block;
    // background-color: $gray80;
    background-color: #FFFFFF;
    border: 1px solid $gray80;
    // color: $white;
    color: $black;
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
