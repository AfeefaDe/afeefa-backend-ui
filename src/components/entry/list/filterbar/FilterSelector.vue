<template>
  <div>
    <a ref="trigger" href="" @click.prevent="openFilterSelector">
      <slot />
    </a>

    <pop-up-selector ref="popUp" :trigger="$refs.trigger" :diffX="10" :diffY="10" align="left" @close="hideFilterSelector" v-if="facetFilterIsOpen">
      <div class="filterSelector">
        <div v-if="showFacetChooser">
          <facet-item-tag v-if="selectedFacet"
            class="selectedFacet"
            @click="openFacetChooser"
            :item="selectedFacet"
            :color="selectedFacet.color"
            :more="true"
            :checkbox="false" />

          <facet-item-tag v-else
            class="selectedFacet"
            @click="openFacetChooser"
            :item="{}"
            title="Navigation"
            color="#999999"
            :more="true"
            :checkbox="false" />

          <div class="facetChooser" v-if="facetSelectorIsOpen">
            <facet-item-tag
              v-for="facet in selectedFacets" :key="'select-' + facet.id"
              @click="selectFacet(facet)"
              :item="facet"
              :color="facet.color"
              :more="false"
              :hint="countFiltersForFacet(facet)"
              :selected="facet === selectedFacet"
              :checkbox="false" />

            <facet-item-tag
              v-if="navigationIsSelected"
              @click="selectNavigation"
              :item="{}"
              title="Navigation"
              color="#999999"
              :more="false"
              :hint="selectedNavigationItem ? 1 : 0"
              :checkbox="false" />
          </div>
        </div>

        <div class="filters" v-if="selectedFacet">
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

        <div class="filters" v-if="navigationFilterIsSelected">
          <div class="navigationItem" v-for="navigationItem in navigation.navigation_items" :key="navigationItem.id">
            <facet-item-tag
              @click="selectOrDeselectNavigationItem(navigationItem)"
              :item="navigationItem"
              :color="navigationItem.color"
              :more="navigationItem.sub_items.length && !navigationItemIsChecked(navigationItem)"
              :hint="countEntriesForNavigationItem(navigationItem)"
              :disabled="!countEntriesForNavigationItem(navigationItem)"
              :checked="navigationItemIsChecked(navigationItem)"
              :checkbox="true" />

              <div class="navigationSubItem" v-for="(subItem, index) in navigationItem.sub_items" :key="subItem.id" v-if="navigationSubItemIsVisible(subItem)">
                <tree-sub-item :isLast="index === navigationItem.sub_items.length - 1">
                  <facet-item-tag
                    @click="selectOrDeselectNavigationItem(subItem)"
                    :item="subItem"
                    :color="navigationItem.color"
                    :more="false"
                    :hint="countEntriesForNavigationItem(subItem)"
                    :disabled="!countEntriesForNavigationItem(subItem)"
                    :checked="subItem === selectedNavigationItem"
                    :checkbox="true" />
                </tree-sub-item>
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
            :checkbox="true" />
        </div>

      </div>
    </pop-up-selector>
  </div>

</template>

<script>
import PopUpSelector from '@/components/PopUpSelector'
import facetItems from '@/helpers/facet-items'
import { mapState, mapGetters } from 'vuex'
import Navigation from '@/models/Navigation'
import TreeSubItem from '@/components/tree/TreeSubItem'

export default {
  data () {
    return {
      facetFilterIsOpen: false,
      facetSelectorIsOpen: false,
      selectedFacet: null,

      navigation: null,
      navigationItemWithoutNavigation: null,
      navigationFilterIsSelected: false
    }
  },

  computed: {
    ...mapGetters('facetFilters', ['selectableFacets']),

    ...mapState({
      selectedFacets: state => state.facetFilters.selectedFacets,
      selectedFacetItems: state => state.facetFilters.selectedFacetItems,
      selectedFacetsWithoutEntries: state => state.facetFilters.selectedFacetsWithoutEntries,
      facetItemFilters: state => state.facetFilters.facetItemFilters,

      navigationIsSelected: state => state.facetFilters.navigationIsSelected,
      selectedNavigationItem: state => state.facetFilters.selectedNavigationItem,

      filteredEntries: state => state.facetFilters.filteredEntries,
      filteredEntriesWithoutNavigation: state => state.facetFilters.filteredEntriesWithoutNavigation
    }),

    showFacetChooser () {
      return this.selectedFacets.length > 1 ||
        (this.selectedFacets.length === 1 && this.navigationIsSelected)
    },

    countEntriesWithoutNavigation () {
      return facetItems.getEntriesWithoutNavigationItem(this.filteredEntriesWithoutNavigation).length
    }
  },

  created () {
    this.computeSelectedFilter()

    Navigation.Query.get().then(navigation => {
      this.navigation = navigation

      this.navigationItemWithoutNavigation = facetItems.createNavigationItemWithoutNavigation(navigation)
    })
  },

  watch: {
    selectedFacets () {
      this.computeSelectedFilter()
    },
    navigationIsSelected () {
      this.computeSelectedFilter()
    }
  },

  methods: {
    openFilterSelector () {
      this.facetFilterIsOpen = true
    },

    hideFilterSelector () {
      this.facetFilterIsOpen = false
      this.hideFacetChooser()
    },

    computeSelectedFilter () {
      // facet was selected
      if (this.selectedFacet && this.selectedFacets.includes(this.selectedFacet)) {
        return
      } else if (this.selectedFacet) {
        this.selectedFacet = null
      }

      // navigation filter was selected
      if (this.navigationFilterIsSelected && this.navigationIsSelected) {
        return
      } else if (this.navigationFilterIsSelected) {
        this.navigationFilterIsSelected = false
      }

      // nothing selected
      if (!this.selectedFacet && this.selectedFacets.length) {
        this.selectedFacet = this.selectedFacets[0]
      } else if (this.navigationIsSelected) {
        this.navigationFilterIsSelected = true
      }
    },

    openFacetChooser () {
      this.facetSelectorIsOpen = true
    },

    hideFacetChooser () {
      this.facetSelectorIsOpen = false
    },

    countFiltersForFacet (facet) {
      return this.facetItemFilters.filter(fi => fi.facet === facet).length
    },

    selectFacet (facet) {
      this.navigationFilterIsSelected = false
      this.selectedFacet = facet
      this.hideFacetChooser()
      this.$nextTick(() => {
        this.$refs.popUp.reposition()
      })
    },

    selectNavigation () {
      this.selectedFacet = null
      this.navigationFilterIsSelected = true
      this.hideFacetChooser()
      this.$nextTick(() => {
        this.$refs.popUp.reposition()
      })
    },

    selectOrDeselectNavigationItem (navigationItem) {
      this.$store.dispatch('facetFilters/selectOrDeselectNavigationItem', navigationItem)
    },

    countEntriesForNavigationItem (navigationItem) {
      return facetItems.getEntriesForNavigationItem(navigationItem, this.filteredEntriesWithoutNavigation).length
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
      this.$store.dispatch('facetFilters/facetItemClick', facetItem)
    },

    countEntriesForFacetItem (facetItem) {
      return facetItems.getEntriesForFacetItem(facetItem, this.filteredEntries).length
    },

    facetItemIsSelected (facetItem) {
      return this.selectedFacetItems.includes(facetItem)
    },

    entriesWithoutFacetIsSelected (facet) {
      return this.selectedFacetsWithoutEntries.includes(facet)
    },

    createEmptyFacetItem (facet) {
      return facetItems.createFacetItemEntriesWithoutFacet(facet)
    },

    entriesWithoutFacetClick (facet) {
      this.$store.dispatch('facetFilters/facetWithoutEntriesClick', facet)
    },

    countEntriesWithoutFacet (facet) {
      return facetItems.getEntriesWithoutFacet(facet, this.filteredEntries).length
    }
  },

  components: {
    PopUpSelector,
    TreeSubItem
  }
}
</script>

<style lang="scss" scoped>
.filterSelector {
  padding: .5em;
  width: 250px;
}

.selectedFacet {
  width: 100%;
  background-color: $white;
  margin-bottom: .8em;

  /deep/ .facetItem {
    width: 100%;
    // border: none;

    .more:before {
      top: -.1em;
      transform: rotate(135deg) scale(.7);
    }
  }
}

.facetChooser {
  /deep/ .facetItem {
    margin-bottom: .2em;
    width: 100%;
  }
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100%;
  box-shadow: 0 2px 5px 0 rgba(0,0,0,0.2), 0 2px 10px 0 rgba(0,0,0,0.2);
  padding: .5em;
  z-index: $z-index-overlay;
}

.filters {
  font-size: .9em;
}

.navigationItem {
  /deep/ .facetItem {
    width: 100%;
  }
}

.navigationSubItem {
  /deep/ .facetItem {
    padding-left: 0;
    border-left-width: 0;
  }
  font-size: .9em;
  margin-left: 1em;
}
</style>

