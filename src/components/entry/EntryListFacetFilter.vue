<template>
  <div :class="{filters: true}">
    <div class="facetItems" v-if="showFilters">
      <tree-item-tag v-for="facetItem in facetItemFilters" :key="facetItem.id"
        class="facetFilterTag"
        :treeItem="facetItem"
        :count="false"
        :x="true"
        @click="facetItemClick(facetItem)" />

      <navigation-item-view
        :navigationItem="selectedNavigationItem"
        v-if="selectedNavigationItem"
        :x="true"
        @click="navigationItemClick" />
    </div>

    <div class="filterLinks" v-if="showFilterIcons">
      <div class="showSelectorLink">
        <facet-selector>
          <div class="selectorLinkIcon">
            <i class="material-icons">settings</i>
            <span class="selectedFacetsHint" v-if="countSelectedFilters">{{ countSelectedFilters }} </span>
          </div>
        </facet-selector>
      </div>

      <facet-item-filter-selector v-if="selectedFacets.length || navigationIsSelected" @click="facetItemClick">
        <div class="selectorLinkIcon">
          <i class="material-icons">filter_list</i>
          <span class="selectedFacetsHint" v-if="countSelectedFilterItems">{{ countSelectedFilterItems }} </span>
        </div>
      </facet-item-filter-selector>
    </div>
  </div>

</template>


<script>
import Facet from '@/models/Facet'
import { mapState, mapGetters } from 'vuex'
import FacetSelector from '@/components/facet/FacetSelector'
import FacetItemFilterSelector from '@/components/facet/FacetItemFilterSelector'
import NavigationItemView from '@/components/fe_navigation/FeNavigationItemView'

export default {
  props: ['showFilters', 'showFilterIcons'],

  created () {
    Facet.Query.getAll().then(facets => {
      this.$store.dispatch('facetFilters/initFacets', facets)
    })
  },

  computed: {
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,
      selectedFacetItems: state => state.facetFilters.selectedFacetItems,

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

  methods: {
    facetItemClick (facetItem) {
      this.$store.dispatch('facetFilters/filteredFacetItemClick', facetItem)
    },

    navigationItemClick (navigationItem) {
      this.$store.dispatch('facetFilters/selectOrDeselectNavigationItem', navigationItem)
    }
  },

  components: {
    FacetSelector,
    FacetItemFilterSelector,
    NavigationItemView
  }
}
</script>


<style lang="scss" scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.facetItems {
  display: flex;
  flex-grow: 1;
}

.filterLinks {
  display: flex;
  justify-content: flex-end;

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

.treeItemTag.facetFilterTag {
  font-size: 1.1em;
  margin-right: .5em;
  margin-bottom: .4em;
}

.navigationItems {
  /deep/ .treeItemTag {
    font-size: 1.1em;
    margin-bottom: .4em;
  }
}
</style>
