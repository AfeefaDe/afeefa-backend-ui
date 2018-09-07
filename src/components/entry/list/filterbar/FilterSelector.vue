<template>
  <div class="filterSelector">
    <div class="facetChooser">
      <facet-item-tag
        @click="selectActiveFilter"
        :item="{}"
        title="Status"
        color="#999999"
        :more="false"
        :hint="selectedActiveState.value !== 'all' ? 1 : 0"
        :selected="activeStateFilterIsSelected"
        :checkbox="false" />

      <div v-for="facet in selectableFacets" :key="'select-' + facet.id">
        <facet-item-tag
          @click="selectFacet(facet)"
          :item="facet"
          :color="facet.color"
          :more="false"
          :hint="countFiltersForFacet(facet)"
          :selected="facet === selectedFacet"
          :checkbox="false" />
      </div>

      <div>
        <facet-item-tag
          v-if="navigationIsSelected"
          @click="selectNavigation"
          :item="{}"
          title="Navigation"
          color="#999999"
          :more="false"
          :hint="selectedNavigationItem ? 1 : 0"
          :selected="navigationFilterIsSelected"
          :checkbox="false" />
      </div>
    </div>

    <div class="filters">
      <div v-if="activeStateFilterIsSelected">
        <div v-for="state in activeStates" :key="state.id">
          <facet-item-tag
            @click="selectActiveState(state)"
            :item="{title: state.name}"
            color="#999999"
            :more="false"
            :hint="countEntriesForActiveState(state)"
            :disabled="!countEntriesForActiveState(state)"
            :checked="state === selectedActiveState"
            :radio="true" />
        </div>
      </div>

      <div v-if="selectedFacet">
        <div v-for="facetItem in selectedFacet.facet_items" :key="facetItem.id">
          <facet-item-tag
            @click="facetItemClick(facetItem)"
            :item="facetItem"
            :color="selectedFacet.color"
            :more="false"
            :hint="countEntriesForFacetItem(facetItem)"
            :disabled="!countEntriesForFacetItem(facetItem)"
            :checked="facetItemIsSelected(facetItem)"
            :checkbox="true" />
        </div>

        <facet-item-tag
          @click="entriesWithoutFacetClick(selectedFacet)"
          :item="selectedFacet"
          title="Nicht zugeordnet"
          :color="selectedFacet.color"
          :more="false"
          :hint="countEntriesWithoutFacet(selectedFacet)"
          :disabled="!countEntriesWithoutFacet(selectedFacet)"
          :checked="entriesWithoutFacetIsSelected(selectedFacet)"
          :checkbox="true" />
      </div>

      <div v-if="navigationFilterIsSelected">
        <div class="navigationItem" v-for="navigationItem in navigation.navigation_items" :key="navigationItem.id">
          <facet-item-tag
            @click="selectOrDeselectNavigationItem(navigationItem)"
            :item="navigationItem"
            :color="navigationItem.color"
            :more="false"
            :hint="countEntriesForNavigationItem(navigationItem)"
            :disabled="!countEntriesForNavigationItem(navigationItem)"
            :checked="navigationItemIsChecked(navigationItem)"
            :radio="true" />

          <div class="subItems" v-if="navigationItemIsChecked(navigationItem)">
            <div class="navigationSubItem" v-for="subItem in navigationItem.sub_items" :key="subItem.id"
              v-if="navigationSubItemIsVisible(subItem)">
              <facet-item-tag
                @click="selectOrDeselectNavigationItem(subItem)"
                :item="subItem"
                :color="selectedNavigationItem.color"
                :more="false"
                :hint="countEntriesForNavigationItem(subItem)"
                :disabled="!countEntriesForNavigationItem(subItem)"
                :checked="subItem === selectedNavigationItem"
                :radio="true" />
            </div>
          </div>
        </div>

        <facet-item-tag
          @click="selectOrDeselectNavigationItem(navigationItemWithoutNavigation)"
          :item="navigationItemWithoutNavigation"
          title="Nicht zugeordnet"
          color="#999999"
          :more="false"
          :hint="countEntriesWithoutNavigation"
          :disabled="!countEntriesWithoutNavigation"
          :checked="navigationItemWithoutNavigation === selectedNavigationItem"
          :radio="true" />
      </div>
    </div>
  </div>

</template>

<script>
import entryListFilters from '@/helpers/entry-list-filters'
import { mapState, mapGetters } from 'vuex'
import Navigation from '@/models/Navigation'

export default {
  props: ['popUp'],

  data () {
    return {
      selectedFacet: null,
      navigationFilterIsSelected: false,
      activeStateFilterIsSelected: true,

      navigation: null,
      navigationItemWithoutNavigation: null
    }
  },

  computed: {
    ...mapGetters('entryListFilters', ['selectableFacets']),

    ...mapState({
      selectedFacetItems: state => state.entryListFilters.selectedFacetItems,
      selectedFacetsWithoutEntries: state => state.entryListFilters.selectedFacetsWithoutEntries,
      facetItemFilters: state => state.entryListFilters.facetItemFilters,

      // navigationIsSelected: state => state.entryListFilters.navigationIsSelected,
      selectedNavigationItem: state => state.entryListFilters.selectedNavigationItem,

      filteredEntries: state => state.entryListFilters.filteredEntries,
      filteredEntriesWithoutNavigation: state => state.entryListFilters.filteredEntriesWithoutNavigation,
      filteredEntriesWithoutActive: state => state.entryListFilters.filteredEntriesWithoutActive,

      activeStates: state => state.entryListFilters.activeStates,
      selectedActiveState: state => state.entryListFilters.selectedActiveState
    }),

    navigationIsSelected () {
      return true
    },

    countEntriesWithoutNavigation () {
      return entryListFilters.getEntriesWithoutNavigationItem(this.filteredEntriesWithoutNavigation).length
    },

    selectedNavigationSubItems () {
      const parent = this.selectedNavigationItem.parent || this.selectedNavigationItem
      return parent.sub_items
    }
  },

  created () {
    Navigation.Query.get().then(navigation => {
      this.navigation = navigation

      this.navigationItemWithoutNavigation = entryListFilters.createNavigationItemWithoutNavigation(navigation)
    })
  },

  methods: {
    countEntriesForActiveState (state) {
      return entryListFilters.getEntriesForActiveState(state, this.filteredEntriesWithoutActive).length
    },

    selectActiveState (state) {
      // set all state if deselect
      if (state === this.selectedActiveState) {
        if (state.value === 'all') {
          return
        }
        state = this.activeStates[0]
      }
      this.$store.dispatch('entryListFilters/setActiveState', state)
      this.popUp.repositionLater()
    },

    countFiltersForFacet (facet) {
      return this.facetItemFilters.filter(fi => fi.facet === facet).length
    },

    selectFacet (facet) {
      this.activeStateFilterIsSelected = false
      this.selectedFacet = facet
      this.navigationFilterIsSelected = false
      this.popUp.repositionLater()
    },

    selectNavigation () {
      this.activeStateFilterIsSelected = false
      this.selectedFacet = null
      this.navigationFilterIsSelected = true
      this.popUp.repositionLater()
    },

    selectActiveFilter () {
      this.activeStateFilterIsSelected = true
      this.selectedFacet = null
      this.navigationFilterIsSelected = false
      this.popUp.repositionLater()
    },

    selectOrDeselectNavigationItem (navigationItem) {
      this.$store.dispatch('entryListFilters/selectOrDeselectNavigationItem', navigationItem)
      this.popUp.repositionLater()
    },

    countEntriesForNavigationItem (navigationItem) {
      return entryListFilters.getEntriesForNavigationItem(navigationItem, this.filteredEntriesWithoutNavigation).length
    },

    navigationSubItemIsVisible (navigationItem) {
      if (!this.selectedNavigationItem) {
        return false
      }
      return navigationItem === this.selectedNavigationItem ||
        navigationItem.parent === this.selectedNavigationItem ||
        navigationItem.parent === this.selectedNavigationItem.parent
    },

    navigationItemIsChecked (navigationItem) {
      if (!this.selectedNavigationItem) {
        return false
      }
      return navigationItem === this.selectedNavigationItem || navigationItem === this.selectedNavigationItem.parent
    },

    facetItemClick (facetItem) {
      this.$store.dispatch('entryListFilters/facetItemClick', facetItem)
      this.popUp.repositionLater()
    },

    countEntriesForFacetItem (facetItem) {
      return entryListFilters.getEntriesForFacetItem(facetItem, this.filteredEntries).length
    },

    facetItemIsSelected (facetItem) {
      return this.selectedFacetItems.includes(facetItem)
    },

    entriesWithoutFacetIsSelected (facet) {
      return this.selectedFacetsWithoutEntries.includes(facet)
    },

    entriesWithoutFacetClick (facet) {
      this.$store.dispatch('entryListFilters/facetWithoutEntriesClick', facet)
    },

    countEntriesWithoutFacet (facet) {
      return entryListFilters.getEntriesWithoutFacet(facet, this.filteredEntries).length
    }
  }
}
</script>

<style lang="scss" scoped>
.filterSelector {
  width: 320px;
  padding: .5em;
  display: inline-flex;
  font-size: .9em;
}

.facetChooser {
  > * {
    margin-bottom: 2px;
  }
  /deep/ .facetItem {
    width: 100%;
    &.selected {
      background-color: $white;
    }
  }
}

.filters {
  padding: .2em 0 .2em 2em;

  .subItems {
    font-size: .9em;
    display: flex;
    flex-wrap: wrap;
    margin: .2em 0 .4em 2em;
  }

  /deep/ .facetItem {
    border-left-width: 0;
    padding: 0;
    margin-right: .5em;
    margin-bottom: .2em;

    .checkbox {
      margin-left: 0;
      // margin-right: .2em;
    }
  }
}
</style>

